import { StatusEnum } from '@prisma/client';
import { FindParams } from '../common';

export interface UserCredentials {
  id: string;
  email: string;
  password: string;
}

export interface ShiftScheduleEntry {
  day: number;
  start: string;
  end: string;
}

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

export interface ChangeRoleData {
  roleId: string;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  password: string;
  roleId: string;
  email: string;
}

export interface CreateSuperUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  birthDate?: Date;
  shiftSchedule?: ShiftScheduleEntry[];
  password?: string;
}
