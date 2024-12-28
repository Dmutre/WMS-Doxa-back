import { ApiResponseProperty } from '@nestjs/swagger';
import { BatchDto } from '../../../api/batch/dto/batch.dto';

export class DeliveryDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  type: string;

  @ApiResponseProperty()
  status: string;

  @ApiResponseProperty()
  scheduledAt: Date;

  @ApiResponseProperty()
  completedAt?: Date;

  @ApiResponseProperty()
  description?: string;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;

  @ApiResponseProperty({ type: () => [BatchDto] })
  batches: BatchDto[];
}

export class DeliveryListDto {
  @ApiResponseProperty({ type: [DeliveryDto] })
  data: DeliveryDto[];

  @ApiResponseProperty()
  total: number;
}
