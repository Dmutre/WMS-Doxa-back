import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserAction } from 'src/lib/decorators/user-action.decorator';
import { AuthPermissions } from 'src/lib/security/decorators/auth-permission';
import { Permissions } from 'src/lib/types/auth/permission';
import { Action } from 'src/lib/types/journal/user-action';
import { CreateRoleDataDto } from './dto/create-role';
import { FindRolesParamsDto } from './dto/find-roles.dto';
import { UpdateRoleDataDto } from './dto/update-role';
import { RoleService } from './role.service';

@Controller()
@ApiTags('Roles')
@ApiBearerAuth()
export class RoleConstroller {
  constructor(private readonly roleService: RoleService) {}

  @UserAction(Action.FIND_PERMISSIONS)
  @AuthPermissions([Permissions.FIND_ROLE])
  @Get('permissions')
  @ApiOperation({ summary: 'Find list of all permissions' })
  async findPerms() {
    return this.roleService.findPerms();
  }

  @UserAction(Action.FIND_ROLES)
  @AuthPermissions([Permissions.FIND_ROLE])
  @Get('roles')
  @ApiOperation({ summary: 'Find list of preset roles' })
  async findRoles(@Query() params: FindRolesParamsDto) {
    return this.roleService.findRoles(params);
  }

  @UserAction(Action.CREATE_ROLE)
  @AuthPermissions([Permissions.CREATE_ROLE])
  @Post('roles')
  @ApiOperation({ summary: 'Create new preset role' })
  async createRole(@Body() data: CreateRoleDataDto) {
    return this.roleService.createRole(data);
  }

  @UserAction(Action.UPDATE_ROLE)
  @AuthPermissions([Permissions.UPDATE_ROLE])
  @Put('roles/:id')
  @ApiOperation({ summary: 'Update preset role by id' })
  async updateRole(@Param('id') id: string, @Body() data: UpdateRoleDataDto) {
    return this.roleService.updateRole(id, data);
  }

  @UserAction(Action.DELETE_ROLE)
  @AuthPermissions([Permissions.DELETE_ROLE])
  @Delete('roles/:id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete preset role by id' })
  async deleteRole(@Param('id') id: string) {
    await this.roleService.deleteRole(id);
  }
}
