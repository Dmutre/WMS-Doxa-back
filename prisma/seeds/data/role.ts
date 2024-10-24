import { Permissions } from '../../../src/lib/types/auth/permission';

export interface PresetRole {
  name: string;
  permissions: Permissions[];
}

export const PresetRoles: PresetRole[] = [
  {
    name: 'Administrator',
    permissions: [Permissions.CREATE_USER],
  },
  {
    name: 'Accounter',
    permissions: [Permissions.CREATE_USER],
  },
  {
    name: 'Employee',
    permissions: [],
  },
];
