import { Prisma } from '@prisma/client';

export interface FindParams<TOrderBy = string> {
  page: number;
  pageSize: number;
  orderDirection: Prisma.SortOrder;
  orderBy: TOrderBy;
}
