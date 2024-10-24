import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FindUsersParamsDto } from './dto/find-users.dto';
import { UserService } from './user.service';

// TODO: Add authorization and permission guards
//       Describe response interfaces
@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UserConstroller {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Find list of users' })
  async findUsers(@Query() params: FindUsersParamsDto) {
    return await this.userService.findUsers(params);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find user by id' })
  async findUser(@Param('id') id: string) {
    return await this.userService.findUser(id);
  }

  @Post(':id/fire')
  @ApiOperation({ summary: 'Fire user by id' })
  async fireUser(@Param('id') id: string) {
    return await this.userService.fireUser(id);
  }
}
