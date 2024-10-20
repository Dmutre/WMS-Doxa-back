import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPermissions } from 'src/lib/security/decorators/auth-permission';
import { Permissions } from 'src/lib/types/permission';
import { RegistrationDTO } from './dto/registration.dto';

@ApiTags('Authorization')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AuthPermissions([Permissions.CREATE_USER])
  @Post('/create-user-profile')
  @ApiOperation({ summary: 'Create user' })
  @ApiOkResponse({})
  @ApiBearerAuth()
  createUserProfile(@Body() data: RegistrationDTO) {
    return this.authService.createUserProfile(data);
  }
}
