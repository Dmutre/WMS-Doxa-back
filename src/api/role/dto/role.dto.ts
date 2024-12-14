import { ApiResponseProperty } from '@nestjs/swagger';
import { Permissions } from '../../../lib/types/auth/permission';

export class PermissionDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty({ enum: Permissions })
  name: Permissions;
}

export class PermissionListDto {
  @ApiResponseProperty({ type: [PermissionDto] })
  data: PermissionDto[];
}

export class RoleDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;

  @ApiResponseProperty()
  isPreset: boolean;
}

export class RolePermissionDto {
  @ApiResponseProperty()
  permissionId: string;

  @ApiResponseProperty()
  roleId: string;

  @ApiResponseProperty({ type: PermissionDto })
  permission: PermissionDto;
}

export class RoleWithPermissionsDto extends RoleDto {
  @ApiResponseProperty({ type: [RolePermissionDto] })
  permissions: RolePermissionDto[];
}

export class RoleWithPermissionsListDto {
  @ApiResponseProperty({ type: [RoleWithPermissionsDto] })
  data: RoleWithPermissionsDto[];

  @ApiResponseProperty()
  total: number;
}
