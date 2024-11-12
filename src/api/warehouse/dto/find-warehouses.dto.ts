import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsBoolean,
} from 'class-validator';
import {
  FindWarehousesParams,
  WarehouseOrderColumn,
} from 'src/lib/types/warehouse';

export class FindWarehousesParamsDTO implements FindWarehousesParams {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  type?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  isActive?: boolean;

  @IsInt()
  @IsPositive()
  @ApiProperty({ default: 1, minimum: 1 })
  page: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({ default: 10, minimum: 1, maximum: 100 })
  pageSize: number;

  @IsEnum(WarehouseOrderColumn)
  @IsOptional()
  @ApiPropertyOptional({ enum: WarehouseOrderColumn })
  orderBy: WarehouseOrderColumn = WarehouseOrderColumn.NAME;

  @IsEnum(Prisma.SortOrder)
  @IsOptional()
  @ApiPropertyOptional({ enum: Prisma.SortOrder })
  orderDirection: Prisma.SortOrder = Prisma.SortOrder.asc;
}
