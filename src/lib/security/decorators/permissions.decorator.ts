import { SetMetadata } from '@nestjs/common';
import { Permissions } from 'src/lib/types/auth/permission';

export const RequiredPermissions = (...permissions: Permissions[]) =>
  SetMetadata('permissions', permissions);
