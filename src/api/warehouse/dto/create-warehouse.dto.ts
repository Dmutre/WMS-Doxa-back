import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { CreateWarehouseData } from 'src/lib/types/warehouse';

export class CreateWarehouseDTO implements CreateWarehouseData {
  @ApiProperty({ description: 'Назва складу' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Тип складу' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Адреса складу' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Координати складу', required: false })
  @IsOptional()
  @IsString()
  coordinates?: string;

  @ApiProperty({ description: 'Примітки про склад', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Площа складу в квадратних метрах',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  area?: number;

  @ApiProperty({
    description: 'Чи активний склад',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiProperty({ description: 'URL фото складу', required: false })
  @IsOptional()
  @IsString()
  photo?: string;
}
