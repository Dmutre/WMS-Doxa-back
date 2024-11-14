import { Permissions } from '../../../src/lib/types/auth/permission';

export interface PresetRole {
  name: string;
  permissions: Permissions[];
}

export const PresetRoles: PresetRole[] = [
  {
    name: 'Superuser',
    permissions: [...Object.values(Permissions)],
  },
];
