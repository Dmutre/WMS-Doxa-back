import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsPositive,
} from 'class-validator';
import { ItemOrderColumn, FindItemsParams } from 'src/lib/types/item';

export class FindItemsParamsDTO implements FindItemsParams {
  @ApiPropertyOptional({
    description: 'Назва товару для пошуку (частковий збіг)',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'SKU (унікальний ідентифікатор товару)',
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ description: 'Категорія товару' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Виробник товару' })
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiPropertyOptional({ description: 'Країна походження товару' })
  @IsOptional()
  @IsString()
  originCountry?: string;

  @IsInt()
  @IsPositive()
  @ApiProperty({ default: 1, minimum: 1 })
  page: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({ default: 10, minimum: 1, maximum: 100 })
  pageSize: number;

  @IsEnum(ItemOrderColumn)
  @IsOptional()
  @ApiPropertyOptional({ enum: ItemOrderColumn })
  orderBy: ItemOrderColumn = ItemOrderColumn.CREATED_AT;

  @IsEnum(Prisma.SortOrder)
  @IsOptional()
  @ApiPropertyOptional({ enum: Prisma.SortOrder })
  orderDirection: Prisma.SortOrder = Prisma.SortOrder.asc;
}
