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
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserAction } from 'src/lib/decorators/user-action.decorator';
import { AuthPermissions } from 'src/lib/security/decorators/auth-permission';
import { Permissions } from 'src/lib/types/auth/permission';
import { Action } from 'src/lib/types/journal/user-action';
import { CreateRoleDataDto } from './dto/create-role';
import { FindRolesParamsDto } from './dto/find-roles.dto';
import {
  PermissionListDto,
  RoleWithPermissionsListDto,
  RoleWithPermissionsDto,
} from './dto/role.dto';
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
  @ApiOkResponse({
    type: PermissionListDto,
  })
  async findPerms() {
    return this.roleService.findPerms();
  }

  @UserAction(Action.FIND_ROLES)
  @AuthPermissions([Permissions.FIND_ROLE])
  @Get('roles')
  @ApiOperation({ summary: 'Find list of preset roles' })
  @ApiOkResponse({
    type: RoleWithPermissionsListDto,
  })
  async findRoles(@Query() params: FindRolesParamsDto) {
    return this.roleService.findRoles(params);
  }

  @UserAction(Action.FIND_ROLE)
  @AuthPermissions([Permissions.FIND_ROLE])
  @Get('roles/:id')
  @ApiOperation({ summary: 'Find role by id' })
  @ApiOkResponse({
    type: RoleWithPermissionsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  async findRole(@Param('id') id: string) {
    return this.roleService.findRole(id);
  }

  @UserAction(Action.CREATE_ROLE)
  @AuthPermissions([Permissions.CREATE_ROLE])
  @Post('roles')
  @ApiOperation({ summary: 'Create new preset role' })
  @ApiResponse({
    status: 201,
    type: RoleWithPermissionsDto,
  })
  async createRole(@Body() data: CreateRoleDataDto) {
    return this.roleService.createRole(data);
  }

  @UserAction(Action.UPDATE_ROLE)
  @AuthPermissions([Permissions.UPDATE_ROLE])
  @Put('roles/:id')
  @ApiOperation({ summary: 'Update role by id' })
  @ApiOkResponse({
    type: RoleWithPermissionsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  async updateRole(@Param('id') id: string, @Body() data: UpdateRoleDataDto) {
    return this.roleService.updateRole(id, data);
  }

  @UserAction(Action.DELETE_ROLE)
  @AuthPermissions([Permissions.DELETE_ROLE])
  @Delete('roles/:id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete preset role by id' })
  @ApiResponse({
    status: 204,
    description: 'Role deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  async deleteRole(@Param('id') id: string) {
    await this.roleService.deleteRole(id);
  }
}
