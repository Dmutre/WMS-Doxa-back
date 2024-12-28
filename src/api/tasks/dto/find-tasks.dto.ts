import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma, TaskStatus } from '@prisma/client';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import {
  FindTasksParams,
  TaskOrderColumn,
  TaskPriority,
} from 'src/lib/types/tasks';

export class FindTasksParamsDto implements FindTasksParams {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @ApiPropertyOptional({ description: 'Пошук за назвою або описом завдання' })
  searchTerm?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional({ description: 'Пошук за кодом завдання' })
  code?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  @ApiPropertyOptional({
    enum: TaskStatus,
    description: 'Статус завдання',
  })
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  @ApiPropertyOptional({
    description: 'Пріоритетність завдання',
    enum: TaskPriority,
  })
  priority?: TaskPriority;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Відобразити/приховати протерміновані завдання',
  })
  isOverdue?: boolean;

  @IsDate()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Мінімальний граничний термін створення завдання',
  })
  createdAtFrom?: Date;

  @IsDate()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Максимальний граничний термін створення завдання',
  })
  createdAtTo?: Date;

  @IsDate()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Мінімальний граничний термін виконання завдання',
  })
  dueDateFrom?: Date;

  @IsDate()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Максимальний граничний термін виконання завдання',
  })
  dueDateTo?: Date;

  @IsDate()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Мінімальний граничний термін початку виконання завдання',
  })
  startDateFrom?: Date;

  @IsDate()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Максимальний граничний термін початку виконання завдання',
  })
  startDateTo?: Date;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Ідентифікатор користувача, якому призначено завдання',
  })
  assigneeId?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Ідентифікатор користувача, який призначив завдання',
  })
  reporterId?: string;

  @IsInt()
  @IsPositive()
  @ApiProperty({ default: 1, minimum: 1 })
  page: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({ default: 10, minimum: 1, maximum: 100 })
  pageSize: number;

  @IsEnum(Prisma.SortOrder)
  @IsOptional()
  @ApiPropertyOptional({
    enum: Prisma.SortOrder,
    default: Prisma.SortOrder.desc,
  })
  orderDirection: Prisma.SortOrder = Prisma.SortOrder.desc;

  @IsEnum(TaskOrderColumn)
  @IsOptional()
  @ApiPropertyOptional({
    enum: TaskOrderColumn,
    default: TaskOrderColumn.CREATED_AT,
  })
  orderBy: TaskOrderColumn = TaskOrderColumn.CREATED_AT;
}
