import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ChangeRoleDataDto } from './dto/change-role.dto';
import { CreateUserDataDto } from './dto/create-user.dto';
import { FindUsersParamsDto } from './dto/find-users.dto';
import { UpdateUserDataDto } from './dto/update-user.dto';
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
  @ApiOperation({ summary: 'Fire active user by id' })
  async fireUser(@Param('id') id: string) {
    return await this.userService.fireUser(id);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore fired user by id' })
  async restoreUser(@Param('id') id: string) {
    return await this.userService.restoreUser(id);
  }

  @Post(':id/change-role')
  @ApiOperation({ summary: 'Change user role by id' })
  async changeRole(@Param('id') id: string, @Body() data: ChangeRoleDataDto) {
    return await this.userService.changeRole(id, data);
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  async createUser(@Body() data: CreateUserDataDto) {
    return await this.userService.createUser(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user by id' })
  async updateUser(@Param('id') id: string, @Body() data: UpdateUserDataDto) {
    return await this.userService.updateUser(id, data);
  }
}
