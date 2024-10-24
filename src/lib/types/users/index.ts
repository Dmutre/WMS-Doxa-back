import { StatusEnum } from '@prisma/client';
import { FindParams } from '../common';

export enum UserOrderColumn {
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export interface FindUsersParams extends FindParams<UserOrderColumn> {
  email?: string;
  firstName?: string;
  lastName?: string;
  status?: StatusEnum;
  roleId?: string;
}
