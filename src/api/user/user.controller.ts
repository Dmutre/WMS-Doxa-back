import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserAction } from 'src/lib/decorators/user-action.decorator';
import { AuthPermissions } from 'src/lib/security/decorators/auth-permission';
import { Action } from 'src/lib/types/journal/user-action';
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

  @UserAction(Action.FIND_USERS)
  @AuthPermissions([])
  @Get()
  @ApiOperation({ summary: 'Find list of users' })
  async findUsers(@Query() params: FindUsersParamsDto) {
    return await this.userService.findUsers(params);
  }

  @UserAction(Action.FIND_USER)
  @AuthPermissions([])
  @Get(':id')
  @ApiOperation({ summary: 'Find user by id' })
  async findUser(@Param('id') id: string) {
    return await this.userService.findUser(id);
  }

  @UserAction(Action.FIRE_USER)
  @AuthPermissions([])
  @Post(':id/fire')
  @ApiOperation({ summary: 'Fire active user by id' })
  async fireUser(@Param('id') id: string) {
    return await this.userService.fireUser(id);
  }

  @UserAction(Action.RESTORE_USER)
  @AuthPermissions([])
  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore fired user by id' })
  async restoreUser(@Param('id') id: string) {
    return await this.userService.restoreUser(id);
  }

  @UserAction(Action.CHANGE_USER_ROLE)
  @AuthPermissions([])
  @Post(':id/change-role')
  @ApiOperation({ summary: 'Change user role by id' })
  async changeRole(@Param('id') id: string, @Body() data: ChangeRoleDataDto) {
    return await this.userService.changeRole(id, data);
  }

  @UserAction(Action.CREATE_USER)
  @AuthPermissions([])
  @Post()
  @ApiOperation({ summary: 'Create user' })
  async createUser(@Body() data: CreateUserDataDto) {
    return await this.userService.createUser(data);
  }

  @UserAction(Action.UPDATE_USER)
  @AuthPermissions([])
  @Put(':id')
  @ApiOperation({ summary: 'Update user by id' })
  async updateUser(@Param('id') id: string, @Body() data: UpdateUserDataDto) {
    return await this.userService.updateUser(id, data);
  }
}
