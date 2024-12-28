import { FindParams } from '../common';

export enum ItemOrderColumn {
  NAME = 'name',
  SKU = 'sku',
  CATEGORY = 'category',
  MANUFACTURER = 'manufacturer',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export interface FindItemsParams extends FindParams<ItemOrderColumn> {
  name?: string;
  sku?: string;
  category?: string;
  manufacturer?: string;
  originCountry?: string;
}

export interface CreateItemData {
  name: string;
  sku: string;
  description?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  category?: string;
  manufacturer?: string;
  expirationDate?: Date;
  warrantyPeriod?: number;
  originCountry?: string;
  photoUrl?: string[];
}

export interface UpdateItemData {
  name?: string;
  sku?: string;
  description?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  category?: string;
  manufacturer?: string;
  expirationDate?: Date;
  warrantyPeriod?: number;
  originCountry?: string;
  photoUrl?: string[];
}
