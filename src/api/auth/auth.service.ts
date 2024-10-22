import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../../database/repository/user.repository';
import { RegistrationDTO } from './dto/registration.dto';
import { hashPassword, validatePassword } from 'src/utils/crypto';
import { RoleRepository } from 'src/database/repository/role.repository';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { JwtPayload } from 'src/lib/types/jwt-payload';
import { LogInDTO } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from 'src/lib/types/configs/auth';

@Injectable()
export class AuthService {
  private authConfig: AuthConfig;

  constructor(
    private readonly userRepo: UserRepository,
    private readonly roleRepo: RoleRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.authConfig = configService.get<AuthConfig>('auth');
  }

  async createUserProfile(data: RegistrationDTO): Promise<User> {
    await this.throwIfUserExists(data.email);
    const hashedPassword = await hashPassword(data.password);
    const role = await this.getPresetRole(data.roleId);
    const { roleId, ...userData } = data;
    const newRole = await this.createNewRoleFromPreseted(role);
    const user = await this.userRepo.createUser({
      ...userData,
      password: hashedPassword,
      role: { connect: newRole },
    });
    return { ...user, password: data.password };
  }

  async verifyUserByToken(token: string): Promise<User> {
    const payload: JwtPayload = this.jwtService.verify(token);
    return await this.userRepo.findByOrThrow({ id: payload.sub });
  }

  private async getPresetRole(roleId: string) {
    const role = await this.roleRepo.findBy({ id: roleId, isPreset: true });
    if (!role) throw new NotFoundException('Preset role is not found');
    return role;
  }

  private async createNewRoleFromPreseted(presetRole: Role) {
    const { id, permissions, ...roleData } = presetRole as any;

    const permissionConnections = permissions.map((rolePermission) => ({
      permission: {
        connect: { id: rolePermission.permissionId },
      },
    }));

    return await this.roleRepo.create({
      ...roleData,
      isPreset: false,
      permissions:
        permissionConnections.length > 0
          ? { create: permissionConnections }
          : undefined,
    });
  }

  private async throwIfUserExists(email: string) {
    const user = await this.userRepo.findBy({ email });
    if (user)
      throw new BadRequestException({
        message: 'User with such email already exists',
      });
  }

  async login(data: LogInDTO) {
    const user = await this.userRepo.findByOrThrow({ email: data.email });
    await validatePassword(data.password, user.password).catch(() => {
      throw new BadRequestException('Invalid credentials');
    });
    return this.getTokens(user);
  }

  private getTokens(user: User): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      createdAt: Date.now(),
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.authConfig.refreshTtl,
      }),
    };
  }
}
