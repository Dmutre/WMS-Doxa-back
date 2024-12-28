import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsBoolean, IsDate } from 'class-validator';
import { UpdateBatchData } from '../../../lib/types/batch';

export class UpdateBatchDTO implements UpdateBatchData {
  @ApiPropertyOptional({ description: 'Кількість товарів у партії' })
  @IsOptional()
  @IsNumber()
  quantity?: number;

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
