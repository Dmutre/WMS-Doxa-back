import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsInt,
  IsPositive,
} from 'class-validator';
import { BatchOrderColumn, FindBatchesParams } from '../../../lib/types/batch';

export class FindBatchesParamsDTO implements FindBatchesParams {
  @ApiPropertyOptional({
    description: 'ID складу, до якого відноситься партія',
  })
  @IsOptional()
  @IsString()
  warehouseId?: string;

  @ApiPropertyOptional({
    description: 'ID товару, до якого відноситься партія',
  })
  @IsOptional()
  @IsString()
  itemId?: string;

  @ApiPropertyOptional({ description: 'Чи зарезервована ця партія' })
  @IsOptional()
  @IsBoolean()
  isReserved?: boolean;

  @ApiPropertyOptional({ description: 'Ряд на складі' })
  @IsOptional()
  @IsNumber()
  row?: number;

  @ApiPropertyOptional({ description: 'Стелаж у ряду' })
  @IsOptional()
  @IsNumber()
  shelf?: number;

  @ApiPropertyOptional({ description: 'Позиція на стелажі' })
  @IsOptional()
  @IsNumber()
  position?: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({ default: 1, minimum: 1 })
  page: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({ default: 10, minimum: 1, maximum: 100 })
  pageSize: number;

  @IsEnum(BatchOrderColumn)
  @IsOptional()
  @ApiPropertyOptional({ enum: BatchOrderColumn })
  orderBy: BatchOrderColumn = BatchOrderColumn.CREATED_AT;

  @IsEnum(Prisma.SortOrder)
  @IsOptional()
  @ApiPropertyOptional({ enum: Prisma.SortOrder })
  orderDirection: Prisma.SortOrder = Prisma.SortOrder.asc;
}
