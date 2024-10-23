import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Post, Body, Res, Controller, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPermissions } from 'src/lib/security/decorators/auth-permission';
import { Permissions } from 'src/lib/types/presets/permission';
import { RegistrationDTO } from './dto/registration.dto';
import { LogInDTO } from './dto/login.dto';
import { Request, Response } from 'express';
import { CookieUtils } from 'src/utils/cookie';
import { CurrentUser } from 'src/lib/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { ChangePasswordDTO } from './dto/change-password.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //@AuthPermissions([Permissions.CREATE_USER])
  @Post('/create-user-profile')
  @ApiOperation({ summary: 'Create user' })
  @ApiOkResponse({}) // write response
  @ApiBearerAuth()
  createUserProfile(@Body() data: RegistrationDTO) {
    return this.authService.createUserProfile(data);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse({}) // write response
  async login(@Body() data: LogInDTO, @Res() response: Response) {
    const tokens = await this.authService.login(data);
    CookieUtils.setRefreshToken(response, tokens.refreshToken);
    response.json({ token: tokens.accessToken });
  }

  @Post('/refresh')
  @ApiOperation({ summary: 'Refresh tokens if refresh token is still valid' })
  @ApiOkResponse({}) // write response
  async refreshToken(@Req() request: Request, @Res() response: Response) {
    const token = CookieUtils.getRefreshToken(request);
    const tokens = await this.authService.refreshTokens(token);
    CookieUtils.setRefreshToken(response, tokens.refreshToken);
    response.json({ token: tokens.accessToken });
  }

  @AuthPermissions([])
  @Post('/change-password')
  @ApiOperation({ summary: 'Change password' })
  @ApiOkResponse({}) // write response
  async changePassword(
    @CurrentUser() user: User,
    @Body() data: ChangePasswordDTO,
  ) {
    return await this.authService.changePassword(user.id, data);
  }

  @AuthPermissions([])
  @Get('/me')
  @ApiOperation({ summary: 'Get current user from token' })
  @ApiOkResponse({}) // write response
  @ApiBearerAuth()
  getCurrentUser(@CurrentUser() user: User) {
    delete user.password;
    return user;
  }
}
