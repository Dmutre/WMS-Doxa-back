import { Test, TestingModule } from '@nestjs/testing';
import { Role, User } from '@prisma/client';
import { Request, Response } from 'express';
import { ClsService } from 'nestjs-cls';
import { CookieUtils } from '../../lib/core/utils/cookie';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { LogInDTO } from './dto/login.dto';

jest.mock('../../lib/core/utils/cookie');

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let clsService: ClsService;

  const mockAuthService = {
    login: jest.fn(),
    refreshTokens: jest.fn(),
    changePassword: jest.fn(),
    me: jest.fn(),
  };

  const mockClsService = {
    get: jest.fn(),
  };

  const mockResponse = () => {
    const res = {} as Response;
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockRequest = (token: string) => {
    const req = {} as Request;
    req.cookies = { refreshToken: token };
    return req;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ClsService, useValue: mockClsService },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    clsService = module.get<ClsService>(ClsService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should log in a user and set refresh token in cookies', async () => {
      const data: LogInDTO = {
        email: 'test@example.com',
        password: 'password',
      };
      const tokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };
      const response = mockResponse();

      jest.spyOn(authService, 'login').mockResolvedValue(tokens);

      await authController.login(data, response);

      expect(authService.login).toHaveBeenCalledWith(data);
      expect(CookieUtils.setRefreshToken).toHaveBeenCalledWith(
        response,
        tokens.refreshToken,
      );
      expect(response.json).toHaveBeenCalledWith({ token: tokens.accessToken });
    });
  });

  describe('refreshToken', () => {
    it('should refresh tokens and set new refresh token in cookies', async () => {
      const token = 'old-refresh-token';
      const tokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };
      const request = mockRequest(token);
      const response = mockResponse();

      jest.spyOn(CookieUtils, 'getRefreshToken').mockReturnValue(token);
      jest.spyOn(authService, 'refreshTokens').mockResolvedValue(tokens);

      await authController.refreshToken(request, response);

      expect(CookieUtils.getRefreshToken).toHaveBeenCalledWith(request);
      expect(authService.refreshTokens).toHaveBeenCalledWith(token);
      expect(CookieUtils.setRefreshToken).toHaveBeenCalledWith(
        response,
        tokens.refreshToken,
      );
      expect(response.json).toHaveBeenCalledWith({ token: tokens.accessToken });
    });
  });

  describe('changePassword', () => {
    it('should change the password for the logged-in user', async () => {
      const data: ChangePasswordDTO = {
        oldPassword: 'old-password',
        newPassword: 'new-password',
      };
      const userId = 'user-id';

      jest.spyOn(clsService, 'get').mockReturnValue(userId);

      await authController.changePassword(data);

      expect(clsService.get).toHaveBeenCalledWith('user.id');
      expect(authService.changePassword).toHaveBeenCalledWith(userId, data);
    });
  });

  describe('me', () => {
    it('should return the current user information', async () => {
      const userId = 'user-id';
      const user: User = {
        id: userId,
        email: 'test@example.com',
        birthDate: new Date(),
        createdAt: new Date(),
        firstName: 'firstname',
        lastName: 'lastname',
        password: 'password',
        phone: 'phone',
        roleId: '',
        shiftSchedule: {},
        status: 'ACTIVE',
        updatedAt: new Date(),
      };

      jest.spyOn(clsService, 'get').mockReturnValue(userId);
      jest
        .spyOn(authService, 'me')
        .mockResolvedValue(user as User & { role: Role });

      const result = await authController.me();

      expect(clsService.get).toHaveBeenCalledWith('user.id');
      expect(authService.me).toHaveBeenCalledWith(userId);
      expect(result).toEqual(user);
    });
  });
});
