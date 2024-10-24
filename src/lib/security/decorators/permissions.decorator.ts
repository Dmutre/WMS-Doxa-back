import { SetMetadata } from '@nestjs/common';
import { Permissions } from 'src/lib/types/auth/permission';

// TODO: Add defined names of permissions to permission argument
export const RequiredPermissions = (...permissions: Permissions[]) =>
  SetMetadata('permissions', permissions);
