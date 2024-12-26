import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import {
  IsDate,
  IsDivisibleBy,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxDate,
  MaxLength,
  MinDate,
} from 'class-validator';
import { IsDateDivisibleBy } from 'src/lib/core/decorators/validation.decorator';
import { CreateTaskData, TaskPriority } from 'src/lib/types/tasks';

export class CreateTaskDataDto implements CreateTaskData {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Короткий зміст завдання',
  })
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Опис завдання',
  })
  @MaxLength(4000)
  description?: string;

  @IsOptional()
  @IsEnum(TaskPriority)
  @ApiPropertyOptional({
    description: 'Пріоритетність завдання',
    enum: TaskPriority,
  })
  priority?: TaskPriority;

  @IsDate()
  @IsDateDivisibleBy(1000 * 60 * 5) // 5 minutes
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Термін початку виконання завдання',
  })
  @MaxDate(new Date(2099, 11, 31)) // 31.12.2099
  @MinDate(new Date(1999, 11, 31)) // 31.12.1999
  startDate?: Date;

  @IsDate()
  @IsDateDivisibleBy(1000 * 60 * 5) // 5 minutes
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Граничний термін виконання завдання',
  })
  @MaxDate(new Date(2099, 11, 31)) // 31.12.2099
  @MinDate(new Date(1999, 11, 31)) // 31.12.1999
  dueDate?: Date;

  @IsInt()
  @IsDivisibleBy(1000 * 60 * 15) // 15 minutes
  @IsPositive()
  @Max(1000 * 60 * 60 * 24 * 365) // 1 year
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Планований час виконання завдання',
  })
  estimate?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Ідентифікатор користувача, якому призначено завдання',
  })
  assigneeId?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Ідентифікатор користувача, який призначив завдання',
  })
  reporterId?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  @ApiPropertyOptional({
    description: 'Статус завдання',
    enum: TaskStatus,
    default: TaskStatus.BACKLOG,
  })
  status: TaskStatus = TaskStatus.BACKLOG;
}
