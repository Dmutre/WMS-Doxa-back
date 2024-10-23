import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role, RolePermissions, User } from '@prisma/client';
import { RoleRepository } from 'src/database/repository/role.repository';
import { JwtPayload } from 'src/lib/types/auth/jwt-payload';
import { AuthConfig } from 'src/lib/types/configs/auth';
import { hashPassword, validatePassword } from 'src/lib/utils/crypto';
import { UserRepository } from '../../database/repository/user.repository';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { LogInDTO } from './dto/login.dto';
import { RegistrationDTO } from './dto/registration.dto';

@Injectable()
export class AuthService {
  private authConfig: AuthConfig;

  constructor(
    private readonly userRepo: UserRepository,
    private readonly roleRepo: RoleRepository,
    private readonly jwtService: JwtService,
    configService: ConfigService,
    // TODO: Replace UserRepository with UserService
    // private readonly userService: UserService,
  ) {
    this.authConfig = configService.get<AuthConfig>('auth');
  }

  async createUserProfile(data: RegistrationDTO): Promise<User> {
    await this.throwIfUserExists(data.email);
    const hashedPassword = await hashPassword(data.password);
    const { roleId, ...userData } = data;
    const role = await this.getPresetRole(roleId);
    const newRole = await this.createNewRoleFromPreseted(role);
    const user = await this.userRepo.createUser({
      ...userData,
      password: hashedPassword,
      role: { connect: newRole },
    });
    return { ...user, password: data.password };
  }

  async verifyUserByToken(token: string): Promise<User> {
    const payload: JwtPayload = await this.verifyToken(token);
    return await this.userRepo.findByOrThrow({ id: payload.sub });
  }

  private async getPresetRole(roleId: string) {
    const role = await this.roleRepo.findBy({ id: roleId, isPreset: true });
    if (!role) throw new NotFoundException('Preset role is not found');
    return role;
  }

  private async createNewRoleFromPreseted(
    presetRole: Role & { permissions: RolePermissions[] },
  ) {
    const { id, permissions, ...roleData } = presetRole;

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

  private async verifyToken(token: string): Promise<JwtPayload> {
    return await this.jwtService.verifyAsync(token).catch(() => {
      throw new BadRequestException({ message: 'Invalid token' });
    });
  }

  async refreshTokens(refreshToken: string) {
    if (!refreshToken)
      throw new BadRequestException({ message: 'Token is required' });
    const payload: JwtPayload = await this.verifyToken(refreshToken);
    const user = await this.userRepo.findByOrThrow({ id: payload.sub });
    return this.getTokens(user);
  }

  async changePassword(userId: string, data: ChangePasswordDTO) {
    const user = await this.userRepo.findByOrThrow({ id: userId });
    await validatePassword(data.oldPassword, user.password).catch(() => {
      throw new BadRequestException('Invalid credentials');
    });
    const newHashedPassword = await hashPassword(data.newPassword);
    const updatedUser = await this.userRepo.updateUser(user.id, {
      password: newHashedPassword,
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
