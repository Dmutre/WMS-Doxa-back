import { Prisma, StatusEnum } from '@prisma/client';

export enum UserOrderColumn {
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export interface FindUsersParams {
  email?: string;
  firstName?: string;
  lastName?: string;
  status?: StatusEnum;
  roleId?: string;
  page: number;
  pageSize: number;
  orderBy: UserOrderColumn;
  orderDirection: Prisma.SortOrder;
}
