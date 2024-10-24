import { FindParams } from '../common';

export enum RoleOrderColumn {
  NAME = 'name',
  CREATED_AT = 'createdAt',
}

export interface FindRolesParams extends FindParams<RoleOrderColumn> {
  name?: string;
}

export class CreateRoleData {
  name: string;
  permissionIds: string[];
}

export class UpdateRoleData {
  name?: string;
  permissionIds?: string[];
}
