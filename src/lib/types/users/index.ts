import { Prisma, StatusEnum } from '@prisma/client';

export enum UserOrderColumn {
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export interface FindParams<TOrderBy = string> {
  page: number;
  pageSize: number;
  orderDirection: Prisma.SortOrder;
  orderBy: TOrderBy;
}

export interface FindUsersParams extends FindParams<UserOrderColumn> {
  email?: string;
  firstName?: string;
  lastName?: string;
  status?: StatusEnum;
  roleId?: string;
}
