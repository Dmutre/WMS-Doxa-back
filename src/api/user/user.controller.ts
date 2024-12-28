import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  HttpCode,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { UserAction } from 'src/lib/decorators/user-action.decorator';
import { AuthPermissions } from 'src/lib/security/decorators/auth-permission';
import { Permissions } from 'src/lib/types/auth/permission';
import { Action } from 'src/lib/types/journal/user-action';
import { ChangeRoleDataDto } from './dto/change-role.dto';
import { CreateUserDataDto } from './dto/create-user.dto';
import { FindUsersParamsDto } from './dto/find-users.dto';
import { UpdateUserDataDto } from './dto/update-user.dto';
import { UserListDto, UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UserConstroller {
  constructor(private readonly userService: UserService) {}

  @UserAction(Action.FIND_USERS)
  @AuthPermissions([Permissions.FIND_USER])
  @Get()
  @ApiOperation({ summary: 'Find list of users' })
  @ApiOkResponse({
    type: [UserListDto],
  })
  async findUsers(@Query() params: FindUsersParamsDto) {
    return await this.userService.findUsers(params);
  }

  @UserAction(Action.FIND_USER)
  @AuthPermissions([Permissions.FIND_USER])
  @Get('/:id')
  @ApiOperation({ summary: 'Find user by id' })
  @ApiOkResponse({
    type: UserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async findUser(@Param('id') id: string) {
    return await this.userService.findUser(id);
  }

  @UserAction(Action.FIRE_USER)
  @AuthPermissions([Permissions.MANAGE_USER])
  @Post('/:id/fire')
  @ApiOperation({ summary: 'Fire active user by id' })
  @HttpCode(200)
  @ApiOkResponse({
    type: UserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'User is already fired',
  })
  async fireUser(@Param('id') id: string) {
    return await this.userService.fireUser(id);
  }

  @UserAction(Action.RESTORE_USER)
  @AuthPermissions([Permissions.MANAGE_USER])
  @Post('/:id/restore')
  @ApiOperation({ summary: 'Restore fired user by id' })
  @HttpCode(200)
  @ApiOkResponse({
    type: UserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'User is not fired',
  })
  async restoreUser(@Param('id') id: string) {
    return await this.userService.restoreUser(id);
  }

  @UserAction(Action.CHANGE_USER_ROLE)
  @AuthPermissions([Permissions.CHANGE_USER_ROLE])
  @Post('/:id/change-role')
  @HttpCode(200)
  @ApiOperation({ summary: 'Change user role by id' })
  @ApiOkResponse({
    type: UserDto,
  })
  async changeRole(@Param('id') id: string, @Body() data: ChangeRoleDataDto) {
    return await this.userService.changeRole(id, data);
  }

  @UserAction(Action.CREATE_USER)
  @AuthPermissions([Permissions.CREATE_USER])
  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 201,
    type: UserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Email is already taken',
  })
  async createUser(@Body() data: CreateUserDataDto) {
    return await this.userService.createUser(data);
  }

  @UserAction(Action.UPDATE_USER)
  @AuthPermissions([Permissions.UPDATE_USER])
  @Put('/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update user by id' })
  @ApiOkResponse({
    type: UserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Email is already taken',
  })
  async updateUser(@Param('id') id: string, @Body() data: UpdateUserDataDto) {
    return await this.userService.updateUser(id, data);
  }
}
