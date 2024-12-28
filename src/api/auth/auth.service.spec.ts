import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service';
import { validatePassword } from '../../lib/core/utils/crypto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LogInDTO } from './dto/login.dto';

jest.mock('../../lib/utils/crypto', () => ({
  validatePassword: jest.fn(),
  hashPassword: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  // eslint-disable-next-line
  let configService: ConfigService;
  // eslint-disable-next-line
  let prismaService: PrismaService;

  const mockUserService = {
    findUserCredentials: jest.fn(),
    updateUser: jest.fn(),
    findUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue({ refreshTtl: '7d' }),
  };

  const mockPrismaService = {
    $queryRaw: jest.fn(),
  };

  const mockUserCredentials = {
    id: 'user-id',
    email: 'test@example.com',
    password: 'hashed-password',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('verifyToken', () => {
    it('should return payload for a valid token', async () => {
      const token = 'valid-token';
      const payload = { sub: 'user-id', email: 'test@example.com' };

      (jwtService.verifyAsync as jest.Mock).mockResolvedValue(payload);

      const result = await authService.verifyToken(token);
      expect(result).toEqual(payload);
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(token);
    });

    it('should throw BadRequestException for invalid token', async () => {
      const token = 'invalid-token';

      (jwtService.verifyAsync as jest.Mock).mockRejectedValue(new Error());

      await expect(authService.verifyToken(token)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('refreshTokens', () => {
    it('should issue new tokens for a valid refresh token', async () => {
      const refreshToken = 'valid-refresh-token';
      const tokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      jest.spyOn(authService, 'verifyToken').mockResolvedValue({
        email: 'test@example.com',
        sub: 'user-id',
        createdAt: 123,
      });
      jest
        .spyOn(userService, 'findUserCredentials')
        .mockResolvedValue(mockUserCredentials);
      // eslint-disable-next-line
      jest.spyOn(authService as any, 'issueTokens').mockReturnValue(tokens);

      const result = await authService.refreshTokens(refreshToken);

      expect(result).toEqual(tokens);
      expect(authService.verifyToken).toHaveBeenCalledWith(refreshToken);
      expect(userService.findUserCredentials).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });
  });

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      const loginData: LogInDTO = {
        email: 'test@example.com',
        password: 'password',
      };
      const tokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      (mockUserService.findUserCredentials as jest.Mock).mockResolvedValue(
        mockUserCredentials,
      );
      (validatePassword as jest.Mock).mockResolvedValue(true);
      // eslint-disable-next-line
      jest.spyOn(authService as any, 'issueTokens').mockReturnValue(tokens);

      const result = await authService.login(loginData);

      expect(result).toEqual(tokens);
      expect(userService.findUserCredentials).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(validatePassword).toHaveBeenCalledWith(
        'password',
        'hashed-password',
      );
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginData: LogInDTO = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      (mockUserService.findUserCredentials as jest.Mock).mockResolvedValue(
        mockUserCredentials,
      );
      (validatePassword as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginData)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
