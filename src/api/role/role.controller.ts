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
import { CreateRoleDataDto } from './dto/create-role';
import { FindRolesParamsDto } from './dto/find-roles.dto';
import { UpdateRoleDataDto } from './dto/update-role';
import { RoleService } from './role.service';

// TODO: Add authorization and permission guards
//       Describe response interfaces
@Controller()
@ApiTags('Roles')
@ApiBearerAuth()
export class RoleConstroller {
  constructor(private readonly roleService: RoleService) {}

  @Get('permissions')
  @ApiOperation({ summary: 'Find list of all permissions' })
  async findPerms() {
    return this.roleService.findPerms();
  }

  @Get('roles')
  @ApiOperation({ summary: 'Find list of preset roles' })
  async findRoles(@Query() params: FindRolesParamsDto) {
    return this.roleService.findRoles(params);
  }

  @Post('roles')
  @ApiOperation({ summary: 'Create new preset role' })
  async createRole(@Body() data: CreateRoleDataDto) {
    return this.roleService.createRole(data);
  }

  @Put('roles/:id')
  @ApiOperation({ summary: 'Update preset role by id' })
  async updateRole(@Param('id') id: string, @Body() data: UpdateRoleDataDto) {
    return this.roleService.updateRole(id, data);
  }

  @Delete('roles/:id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete preset role by id' })
  async deleteRole(@Param('id') id: string) {
    await this.roleService.deleteRole(id);
  }
}
