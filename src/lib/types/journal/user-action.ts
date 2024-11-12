import { FindParams } from '../common';

export enum UserActionOrderColumn {
  CREATED_AT = 'createdAt',
}

export interface FindUserActionsParams
  extends FindParams<UserActionOrderColumn> {
  ip?: string;
  userId?: string;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  action?: string;
}
