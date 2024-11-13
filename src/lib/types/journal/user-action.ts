import { Prisma } from '@prisma/client';
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

export interface CreateUserActionData {
  userId: string | null;
  ip: string;
  action: string;
  payload: Prisma.InputJsonObject;
}

export enum Action {
  FIND_USER_ACTIONS = 'findUserActions',
  FIND_PERMISSIONS = 'findPermissions',
  FIND_ROLES = 'findRoles',
  CREATE_ROLE = 'createRole',
  UPDATE_ROLE = 'updateRole',
  DELETE_ROLE = 'deleteRole',
  FIND_USERS = 'findUsers',
  FIND_USER = 'findUser',
  FIRE_USER = 'fireUser',
  RESTORE_USER = 'restoreUser',
  CHANGE_USER_ROLE = 'changeRole',
  CREATE_USER = 'createUser',
  UPDATE_USER = 'updateUser',
  CREATE_WEREHOUSE = 'createWerehouse',
  FIND_WEREHOUSES = 'findWerehouses',
  FIND_WEREHOUSE = 'findWerehouse',
  UPDATE_WEREHOUSE = 'updateWerehouse',
  DELETE_WEREHOUSE = 'deleteWerehouse',
  CONNECT_USER_TO_WEREHOUSE = 'connectUserToWerehouse',
  GET_USER_WEREHOUSES = 'getUserWerehouses',
}

export interface UserActionContext {
  action: Action;
}
