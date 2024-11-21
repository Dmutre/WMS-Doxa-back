import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { CreateItemData } from 'src/lib/types/item';

export class CreateItemDTO implements CreateItemData {
  @ApiProperty({ description: 'Назва товару' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'SKU (унікальний ідентифікатор товару)' })
  @IsString()
  sku: string;

  @ApiPropertyOptional({ description: 'Опис товару' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Штрих-код товару' })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional({ description: 'Вага товару в кілограмах' })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({ description: 'Розміри товару (ДxШxВ)' })
  @IsOptional()
  @IsString()
  dimensions?: string;

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
}
