import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { JwtPayload } from 'src/lib/types/auth/jwt-payload';
import { AuthConfig } from 'src/lib/types/configs/auth';
import { hashPassword, validatePassword } from 'src/lib/utils/crypto';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { LogInDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  private authConfig: AuthConfig;
  private readonly userRepo: Prisma.UserDelegate;

  constructor(private readonly jwtService: JwtService) {}

  async verifyUserByToken(token: string): Promise<User> {
    const payload: JwtPayload = await this.verifyToken(token);
    return await this.findByOrThrowUser({ id: payload.sub });
  }

  private async findByOrThrowUser(where: Prisma.UserWhereInput) {
    const user = await this.userRepo.findFirst({ where });
    if (!user) throw new NotFoundException({ message: 'User not found' });
    return user;
  }

  async login(data: LogInDTO) {
    const user = await this.findByOrThrowUser({ email: data.email });
    await validatePassword(data.password, user.password).catch(() => {
      throw new BadRequestException('Invalid credentials');
    });
    return this.getTokens(user);
  }

  private async verifyToken(token: string): Promise<JwtPayload> {
    return await this.jwtService.verifyAsync(token).catch(() => {
      throw new BadRequestException({ message: 'Invalid token' });
    });
  }

  async refreshTokens(refreshToken: string) {
    if (!refreshToken)
      throw new BadRequestException({ message: 'Token is required' });
    const payload: JwtPayload = await this.verifyToken(refreshToken);
    const user = await this.findByOrThrowUser({ id: payload.sub });
    return this.getTokens(user);
  }

  async changePassword(userId: string, data: ChangePasswordDTO) {
    const user = await this.findByOrThrowUser({ id: userId });
    await validatePassword(data.oldPassword, user.password).catch(() => {
      throw new BadRequestException('Invalid credentials');
    });
    const newHashedPassword = await hashPassword(data.newPassword);
    const updatedUser = await this.userRepo.update({
      where: { id: user.id },
      data: {
        password: newHashedPassword,
      },
    });
    delete updatedUser.password;
    return updatedUser;
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
