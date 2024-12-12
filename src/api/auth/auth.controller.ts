import {
  Post,
  Body,
  Res,
  Controller,
  Get,
  Req,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ClsService } from 'nestjs-cls';
import { AuthPermissions } from '../../lib/security/decorators/auth-permission';
import { AppContext } from '../../lib/types/common';
import { CookieUtils } from '../../lib/utils/cookie';
import { UserDto } from '../user/dto/user.dto';
import { AuthService } from './auth.service';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { LogInDTO } from './dto/login.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cls: ClsService<AppContext>,
  ) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login user' })
  @HttpCode(200)
  @ApiOkResponse({
    description: 'User logged in',
    schema: { type: 'object', properties: { token: { type: 'string' } } },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body() data: LogInDTO, @Res() response: Response) {
    const tokens = await this.authService.login(data);
    CookieUtils.setRefreshToken(response, tokens.refreshToken);
    response.json({ token: tokens.accessToken });
  }

  @Post('/refresh')
  @ApiOperation({ summary: 'Refresh tokens if refresh token is still valid' })
  @HttpCode(200)
  @ApiOkResponse({
    description: 'User logged in',
    schema: { type: 'object', properties: { token: { type: 'string' } } },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid token',
  })
  async refreshToken(@Req() request: Request, @Res() response: Response) {
    const token = CookieUtils.getRefreshToken(request);
    const tokens = await this.authService.refreshTokens(token);
    CookieUtils.setRefreshToken(response, tokens.refreshToken);
    response.json({ token: tokens.accessToken });
  }

  @AuthPermissions([])
  @Post('/change-password')
  @ApiOperation({ summary: 'Change password' })
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async changePassword(@Body() data: ChangePasswordDTO) {
    const userId = this.cls.get('user.id');
    await this.authService.changePassword(userId, data);
    return { message: 'Password changed successfully' };
  }

  @AuthPermissions([])
  @Get('/me')
  @ApiOperation({ summary: 'Get current user from token' })
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    type: UserDto,
  })
  async me() {
    const userId = this.cls.get('user.id');
    return await this.authService.me(userId);
  }
}
