import { FindParams } from '../common';

export enum BatchOrderColumn {
  RECEIVED_AT = 'receivedAt',
  EXPIRY_DATE = 'expiryDate',
  QUANTITY = 'quantity',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export interface FindBatchesParams extends FindParams<BatchOrderColumn> {
  warehouseId?: string;
  itemId?: string;
  isReserved?: boolean;
  row?: number;
  shelf?: number;
  position?: number;
}

export interface CreateBatchData {
  warehouseId: string;
  itemId: string;
  quantity: number;
  row?: number;
  shelf?: number;
  position?: number;
  width?: number;
  height?: number;
  depth?: number;
  weight?: number;
  receivedAt?: Date;
  expiryDate?: Date;
  isReserved?: boolean;
}

export interface UpdateBatchData {
  quantity?: number;
  row?: number;
  shelf?: number;
  position?: number;
  width?: number;
  height?: number;
  depth?: number;
  weight?: number;
  receivedAt?: Date;
  expiryDate?: Date;
  isReserved?: boolean;
}
