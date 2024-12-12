import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { JwtPayload } from '../../lib/types/auth/jwt-payload';
import { Permissions } from '../../lib/types/auth/permission';
import { AuthConfig } from '../../lib/types/configs/auth';
import { UserCredentials } from '../../lib/types/users';
import { hashPassword, validatePassword } from '../../lib/utils/crypto';
import { UserService } from '../user/user.service';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { LogInDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  private authConfig: AuthConfig;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly userService: UserService,
  ) {
    this.authConfig = this.config.get<AuthConfig>('auth');
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    const payload: JwtPayload = await this.jwtService
      .verifyAsync(token)
      .catch(() => {
        throw new BadRequestException({ message: 'Invalid token' });
      });
    return payload;
  }

  async refreshTokens(refreshToken: string) {
    if (!refreshToken)
      throw new BadRequestException({ message: 'Token is required' });
    const payload: JwtPayload = await this.verifyToken(refreshToken);
    const creds = await this.userService.findUserCredentials({
      email: payload.email,
    });
    return this.issueTokens(creds);
  }

  private issueTokens(creds: UserCredentials): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload: JwtPayload = {
      sub: creds.id,
      email: creds.email,
      createdAt: Date.now(),
    };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.authConfig.refreshTtl,
      }),
    };
  }

  async login(data: LogInDTO) {
    const creds = await this.userService.findUserCredentials({
      email: data.email,
    });
    const isValid =
      creds && (await validatePassword(data.password, creds.password));
    if (!isValid)
      throw new UnauthorizedException({ message: 'Invalid credentials' });
    return this.issueTokens(creds);
  }

  async changePassword(userId: string, data: ChangePasswordDTO) {
    const creds = await this.userService.findUserCredentials({
      id: userId,
    });
    const isValid =
      creds && (await validatePassword(data.oldPassword, creds.password));
    if (!isValid)
      throw new UnauthorizedException({ message: 'Invalid credentials' });
    const newHashedPassword = await hashPassword(data.newPassword);
    await this.userService.updateUser(userId, {
      password: newHashedPassword,
    });
  }

  async me(userId: string) {
    const user = await this.userService.findUser(userId);
    return user;
  }

  async verifyPermissions(
    userId: string,
    permissions: Permissions[],
  ): Promise<boolean> {
    if (!permissions.length) return true;
    try {
      const [{ res }]: [{ res: boolean }] = await this.prisma.$queryRaw`
        WITH perms AS (
          SELECT P.name AS perm
          FROM "users" U
          JOIN "roles" R ON U.role_id = R.id
          JOIN "role_permissions" RP ON RP.role_id = R.id
          JOIN "permissions" P ON P.id = RP.permission_id
          WHERE U.id = ${userId}
        )
        SELECT
          ${permissions}::text[] <@ array_agg(perm) AS res
        FROM perms;
      `;
      return res;
    } catch (error) {
      return false;
    }
  }
}
