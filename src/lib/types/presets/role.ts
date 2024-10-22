import { Role } from '@prisma/client';
import { Permissions } from './permission';

export const PresetRoles: Role[] | any[] = [
  {
    name: 'Administrator',
    isPreset: true,
    permissions: [Permissions.CREATE_USER],
  },
  {
    name: 'Accounter',
    isPreset: true,
    permissions: [Permissions.CREATE_USER],
  },
  {
    name: 'Employee',
    isPreset: true,
    permissions: [],
  },
];
