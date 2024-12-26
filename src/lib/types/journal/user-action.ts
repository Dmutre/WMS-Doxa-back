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
  FIND_ROLE = 'findRole',
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
  CREATE_BATCH = 'createBatch',
  UPDATE_BATCH = 'updateBatch',
  FIND_BATCH = 'findBatch',
  FIND_BATCHES = 'findBatches',
  DELETE_BATCH = 'deleteBatch',
  CREATE_ITEM = 'createItem',
  UPDATE_ITEM = 'updateItem',
  DELETE_ITEM = 'deleteItem',
  FIND_ITEM = 'findItem',
  FIND_ITEMS = 'findItems',
  FIND_TASKS = 'findTasks',
  FIND_TASK = 'findTask',
  DELETE_TASK = 'deleteTask',
  CREATE_TASK = 'createTask',
  UPDATE_TASK = 'updateTask',
  CREATE_DELIVERY = 'createDelivery',
  UPDATE_DELIVERY = 'updateDelivery',
  FIND_DELIVERY = 'findDelivery',
  FIND_DELIVERIES = 'findDeliveries',
  DELETE_DELIVERY = 'deleteDelivery',
}
