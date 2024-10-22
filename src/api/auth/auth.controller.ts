import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Post, Body, Res, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPermissions } from 'src/lib/security/decorators/auth-permission';
import { Permissions } from 'src/lib/types/presets/permission';
import { RegistrationDTO } from './dto/registration.dto';
import { LogInDTO } from './dto/login.dto';
import { Response } from 'express';
import { CookieUtils } from 'src/utils/cookie';

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
}
