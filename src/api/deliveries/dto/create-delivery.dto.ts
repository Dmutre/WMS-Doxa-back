import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DeliveryType, DeliveryStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsString,
  IsDate,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateBatchDTO } from '../../../api/batch/dto/create-batch.dto';

export class CreateDeliveryDTO {
  @ApiProperty({ enum: DeliveryType })
  @IsEnum(DeliveryType)
  type: DeliveryType;

  @ApiProperty({ enum: DeliveryStatus })
  @IsEnum(DeliveryStatus)
  status: DeliveryStatus;

  @ApiProperty({ description: 'Запланований час доставки' })
  @IsDate()
  scheduledAt: Date;

  @ApiPropertyOptional({ description: 'Час завершення доставки' })
  @IsOptional()
  @IsDate()
  completedAt?: Date;

  @ApiPropertyOptional({ description: 'Опис доставки' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    type: [CreateBatchDTO],
    description: 'Масив об’єктів для створення партій',
  })
  @ValidateNested({ each: true })
  @Type(() => CreateBatchDTO)
  batches: CreateBatchDTO[];
}
