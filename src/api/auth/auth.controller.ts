import {
  Post,
  Body,
  Res,
  Controller,
  Get,
  Req,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ClsService } from 'nestjs-cls';
import { AuthPermissions } from 'src/lib/security/decorators/auth-permission';
import { AppContext } from 'src/lib/types/common';
import { CookieUtils } from 'src/lib/utils/cookie';
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
  async login(@Body() data: LogInDTO, @Res() response: Response) {
    const tokens = await this.authService.login(data);
    CookieUtils.setRefreshToken(response, tokens.refreshToken);
    response.json({ token: tokens.accessToken });
  }

  @Post('/refresh')
  @ApiOperation({ summary: 'Refresh tokens if refresh token is still valid' })
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
  @HttpCode(204)
  async changePassword(@Body() data: ChangePasswordDTO) {
    const userId = this.cls.get('user.id');
    await this.authService.changePassword(userId, data);
  }

  @AuthPermissions([])
  @Get('/me')
  @ApiOperation({ summary: 'Get current user from token' })
  @ApiBearerAuth()
  async me() {
    const userId = this.cls.get('user.id');
    return await this.authService.me(userId);
  }
}
