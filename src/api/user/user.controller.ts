import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthPermissions } from 'src/lib/security/decorators/auth-permission';
import { FindUsersParamsDto } from './dto/find-users.dto';
import { UserService } from './user.service';

// TODO: Add authorization and permission guards
//       Describe response interfaces
@Controller('users')
@ApiTags('Users')
export class UserConstroller {
  constructor(private readonly userService: UserService) {}

  @AuthPermissions([])
  @Get()
  @ApiOperation({ summary: 'Find list of users' })
  @ApiBearerAuth()
  async findUsers(@Query() params: FindUsersParamsDto) {
    return await this.userService.findUsers(params);
  }

  @AuthPermissions([])
  @Get(':id')
  @ApiOperation({ summary: 'Find user by id' })
  @ApiBearerAuth()
  async findUser(@Query('id') id: string) {
    return await this.userService.findUser(id);
  }

  @AuthPermissions([])
  @Post(':id/fire')
  @ApiOperation({ summary: 'Fire user by id' })
  @ApiBearerAuth()
  async fireUser(@Query('id') id: string) {
    return await this.userService.fireUser(id);
  }
}
