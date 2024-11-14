import { Prisma } from '@prisma/client';
import { ClsStore } from 'nestjs-cls';

export interface AppContext extends ClsStore {
  user: {
    id: string;
    email: string;
  };
}

export interface FindParams<TOrderBy = string> {
  page: number;
  pageSize: number;
  orderDirection: Prisma.SortOrder;
  orderBy: TOrderBy;
}
