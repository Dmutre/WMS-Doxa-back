import { TaskStatus } from '@prisma/client';
import { FindParams } from '../common';

export enum TaskPriority {
  LOWEST = 10,
  LOW = 20,
  MEDIUM = 30,
  HIGH = 40,
  HIGHEST = 50,
}

export enum TaskOrderColumn {
  Title = 'title',
  CODE = 'code',
  PRIORITY = 'priority',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  DUE_DATE = 'dueDate',
  START_DATE = 'startDate',
}

export interface FindTasksParams extends FindParams<TaskOrderColumn> {
  searchTerm?: string;
  code?: string;
  status?: TaskStatus;
  priority?: number;
  isOverdue?: boolean;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  dueDateFrom?: Date;
  dueDateTo?: Date;
  startDateFrom?: Date;
  startDateTo?: Date;
  assigneeId?: string;
  reporterId?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: number;
  estimate?: number;
  startDate?: Date;
  dueDate?: Date;
  assigneeId?: string;
  reporterId?: string;
  status: TaskStatus;
}

export interface UpdateTaskData {
  title?: string;
  description?: string | null;
  priority?: number | null;
  startDate?: Date | null;
  dueDate?: Date | null;
  estimate?: number | null;
  assigneeId?: string | null;
  reporterId?: string | null;
  status?: TaskStatus;
}
