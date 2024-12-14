import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DeliveryType, DeliveryStatus, Prisma } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import {
  DeliveryOrderColumn,
  FindDeliveriesParams,
} from '../../../lib/types/delivery';

export class FindDeliveriesParamsDTO implements FindDeliveriesParams {
  @ApiPropertyOptional({ enum: DeliveryType })
  @IsOptional()
  @IsEnum(DeliveryType)
  type?: DeliveryType;

  @ApiPropertyOptional({ enum: DeliveryStatus })
  @IsOptional()
  @IsEnum(DeliveryStatus)
  status?: DeliveryStatus;

  @ApiPropertyOptional({ description: 'ID доставки' })
  @IsOptional()
  @IsString()
  id?: string;

  @IsInt()
  @IsPositive()
  @ApiProperty({ default: 1, minimum: 1 })
  page: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({ default: 10, minimum: 1, maximum: 100 })
  pageSize: number;

  @IsEnum(DeliveryOrderColumn)
  @IsOptional()
  @ApiPropertyOptional({ enum: DeliveryOrderColumn })
  orderBy: DeliveryOrderColumn = DeliveryOrderColumn.CREATED_AT;

  @IsEnum(Prisma.SortOrder)
  @IsOptional()
  @ApiPropertyOptional({ enum: Prisma.SortOrder })
  orderDirection: Prisma.SortOrder = Prisma.SortOrder.asc;
}
