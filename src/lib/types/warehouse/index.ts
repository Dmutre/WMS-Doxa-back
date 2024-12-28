import { FindParams } from '../common';

export enum WarehouseOrderColumn {
  NAME = 'name',
  TYPE = 'type',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export interface FindWarehousesParams extends FindParams<WarehouseOrderColumn> {
  name?: string;
  type?: string;
  address?: string;
  isActive?: boolean;
}

export interface CreateWarehouseData {
  name: string;
  type: string;
  address: string;
  coordinates?: string;
  notes?: string;
  area?: number;
  isActive?: boolean;
  photo?: string;
}

export interface UpdateWarehouseData {
  name?: string;
  type?: string;
  address?: string;
  coordinates?: string;
  notes?: string;
  area?: number;
  isActive?: boolean;
  photo?: string;
}

export interface ConnectUserToWarehouseData {
  userId: string;
  warehouseId: string;
}
