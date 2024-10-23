import { applyDecorators, UseGuards } from '@nestjs/common';
import { Permissions } from 'src/lib/presets/permission';
import { AuthGuard } from '../auth.guard';
import { PermissionGuard } from '../permission.guard';
import { RequiredPermissions } from './permissions.decorator';

export function AuthPermissions(permissions: Permissions[]) {
  return applyDecorators(
    UseGuards(AuthGuard, PermissionGuard),
    RequiredPermissions(...permissions),
  );
}
