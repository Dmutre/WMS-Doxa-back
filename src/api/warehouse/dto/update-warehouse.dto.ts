import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { UpdateWarehouseData } from 'src/lib/types/warehouse';

export class UpdateWarehouseDTO implements UpdateWarehouseData {
  @ApiPropertyOptional({ description: 'Назва складу' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Тип складу' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: 'Адреса складу' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Координати складу',
    required: false,
  })
  @IsOptional()
  @IsString()
  coordinates?: string;

  @ApiPropertyOptional({
    description: 'Примітки про склад',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Площа складу в квадратних метрах',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  area?: number;

  @ApiPropertyOptional({
    description: 'Чи активний склад',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'URL фотографії складу',
    required: false,
  })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiPropertyOptional({
    description: 'Час останнього оновлення',
    required: false,
  })
  updatedAt: Date = new Date();
}
