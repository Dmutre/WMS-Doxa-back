import { CreateBatchData } from '../batch';
import { FindParams } from '../common';

export enum DeliveryOrderColumn {
  SCHEDULED_AT = 'scheduledAt',
  COMPLETED_AT = 'completedAt',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export interface FindDeliveriesParams extends FindParams<DeliveryOrderColumn> {
  type?: string;
  status?: string;
  scheduledFrom?: Date;
  scheduledTo?: Date;
  completedFrom?: Date;
  completedTo?: Date;
}

export interface CreateDeliveryData {
  type: string;
  status: string;
  scheduledAt: Date;
  completedAt?: Date;
  description?: string;
  batches?: CreateBatchData[];
}

export interface UpdateDeliveryData {
  status?: string;
  completedAt?: Date;
  description?: string;
}
