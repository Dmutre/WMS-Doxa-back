import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TestingModule, Test } from '@nestjs/testing';
import { ClsModule } from 'nestjs-cls';
import { AuthModule } from 'src/api/auth/auth.module';
import { AuthService } from 'src/api/auth/auth.service';
import { ChangePasswordDTO } from 'src/api/auth/dto/change-password.dto';
import { LogInDTO } from 'src/api/auth/dto/login.dto';
import { UserModule } from 'src/api/user/user.module';
import { UserService } from 'src/api/user/user.service';
import { PrismaService } from 'src/database/prisma.service';
import { hashPassword, validatePassword } from 'src/lib/core/utils/crypto';
import authConfig from '../../../src/lib/configs/auth.config';

describe('AuthService (Integration)', () => {
  let authService: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService; // eslint-disable-line
  let userService: UserService; // eslint-disable-line

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService, JwtService, ConfigService],
      imports: [
        UserModule,
        AuthModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [authConfig],
        }),
        ClsModule.forRoot({
          global: true,
          middleware: { mount: true },
        }),
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);

    await prisma.$connect();

    // Clear and seed the database before running tests
    await prisma.user.deleteMany();
    await prisma.user.create({
      data: {
        id: '1',
        email: 'test@example.com',
        password: await hashPassword('Password@123'),
        firstName: 'Test',
        lastName: 'Testovich',
        role: {
          create: {
            name: 'ADMIN',
          },
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('login', () => {
    it('should log in user and return tokens', async () => {
      const loginDto: LogInDTO = {
        email: 'test@example.com',
        password: 'Password@123',
      };

      const result = await authService.login(loginDto);

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto: LogInDTO = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens with a valid refresh token', async () => {
      const loginDto: LogInDTO = {
        email: 'test@example.com',
        password: 'Password@123',
      };
      const { refreshToken } = await authService.login(loginDto);

      const result = await authService.refreshTokens(refreshToken);

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw BadRequestException if token is invalid', async () => {
      await expect(authService.refreshTokens('invalidToken')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('changePassword', () => {
    it('should change the password successfully', async () => {
      const loginDto: LogInDTO = {
        email: 'test@example.com',
        password: 'Password@123',
      };
      const { accessToken } = await authService.login(loginDto); // eslint-disable-line

      const changePasswordDto: ChangePasswordDTO = {
        oldPassword: 'Password@123',
        newPassword: 'NewPassword@456',
      };

      await authService.changePassword('1', changePasswordDto);

      const isValid = await validatePassword(
        'NewPassword@456',
        (await prisma.user.findUnique({ where: { email: 'test@example.com' } }))
          .password,
      );

      expect(isValid).toBe(true);
    });

    it('should throw UnauthorizedException for incorrect old password', async () => {
      const changePasswordDto: ChangePasswordDTO = {
        oldPassword: 'WrongPassword',
        newPassword: 'NewPassword@456',
      };

      await expect(
        authService.changePassword('1', changePasswordDto),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('me', () => {
    it('should return the current user data', async () => {
      const userId = (
        await prisma.user.findUnique({ where: { email: 'test@example.com' } })
      ).id;
      const result = await authService.me(userId);

      expect(result.email).toBe('test@example.com');
    });
  });
});
