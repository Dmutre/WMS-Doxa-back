import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { CreateBatchData } from '../../../lib/types/batch';

export class CreateBatchDTO implements CreateBatchData {
  @ApiProperty({ description: 'ID складу, до якого прив’язана партія' })
  @IsString()
  warehouseId: string;

  @ApiProperty({ description: 'ID товару, до якого відноситься ця партія' })
  @IsString()
  itemId: string;

  @ApiProperty({ description: 'Кількість товарів у партії' })
  @IsNumber()
  quantity: number;

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

  @ApiPropertyOptional({ description: 'Ширина партії в метрах' })
  @IsOptional()
  @IsNumber()
  width?: number;

  @ApiPropertyOptional({ description: 'Висота партії в метрах' })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiPropertyOptional({ description: 'Глибина партії в метрах' })
  @IsOptional()
  @IsNumber()
  depth?: number;

  @ApiPropertyOptional({ description: 'Вага партії в кілограмах' })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({ description: 'Дата отримання партії на склад' })
  @IsOptional()
  @IsDate()
  receivedAt?: Date;

  @ApiPropertyOptional({ description: 'Термін придатності партії' })
  @IsOptional()
  @IsDate()
  expiryDate?: Date;

  @ApiPropertyOptional({ description: 'Чи зарезервована ця партія' })
  @IsOptional()
  @IsBoolean()
  isReserved?: boolean;
}
