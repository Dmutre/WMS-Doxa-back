import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth.guard';
import { PermissionGuard } from '../permission.guard';
import { RequiredPermissions } from './permissions.decorator';
import { Permissions } from '../../types/permission';

export function AuthPermissions(permissions: Permissions[]) {
  return applyDecorators(
    UseGuards(AuthGuard, PermissionGuard),
    RequiredPermissions(...permissions),
  );
}
