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
import {
  IsDateDivisibleBy,
  IsNullable,
} from 'src/lib/core/decorators/validation.decorator';
import { TaskPriority, UpdateTaskData } from 'src/lib/types/tasks';

export class UpdateTaskDataDto implements UpdateTaskData {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Короткий зміст завдання',
  })
  @MaxLength(255)
  title?: string;

  @IsNullable()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Опис завдання',
  })
  @MaxLength(4000)
  description?: string | null;

  @IsNullable()
  @IsOptional()
  @IsEnum(TaskPriority)
  @ApiPropertyOptional({
    description: 'Пріоритетність завдання',
    enum: TaskPriority,
  })
  priority?: TaskPriority | null;

  @IsNullable()
  @IsDate()
  @IsDateDivisibleBy(1000 * 60 * 5) // 5 minutes
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Термін початку виконання завдання',
  })
  @MaxDate(new Date(2099, 11, 31)) // 31.12.2099
  @MinDate(new Date(1999, 11, 31)) // 31.12.1999
  startDate?: Date | null;

  @IsNullable()
  @IsDate()
  @IsDateDivisibleBy(1000 * 60 * 5) // 5 minutes
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Граничний термін виконання завдання',
  })
  @MaxDate(new Date(2099, 11, 31)) // 31.12.2099
  @MinDate(new Date(1999, 11, 31)) // 31.12.1999
  dueDate?: Date | null;

  @IsNullable()
  @IsInt()
  @IsDivisibleBy(1000 * 60 * 15) // 15 minutes
  @IsPositive()
  @Max(1000 * 60 * 60 * 24 * 365) // 1 year
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Планований час виконання завдання',
  })
  estimate?: number | null;

  @IsNullable()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Ідентифікатор користувача, якому призначено завдання',
  })
  assigneeId?: string | null;

  @IsNullable()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Ідентифікатор користувача, який призначив завдання',
  })
  reporterId?: string | null;

  @IsOptional()
  @IsEnum(TaskStatus)
  @ApiPropertyOptional({
    description: 'Статус завдання',
    enum: TaskStatus,
  })
  status?: TaskStatus;
}
