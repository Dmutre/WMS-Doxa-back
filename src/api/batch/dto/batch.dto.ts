import { ApiResponseProperty } from '@nestjs/swagger';

export class BatchDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  warehouseId: string;

  @ApiResponseProperty()
  itemId: string;

  @ApiResponseProperty()
  quantity: number;

  @ApiResponseProperty()
  row: number;

  @ApiResponseProperty()
  shelf: number;

  @ApiResponseProperty()
  position: number;

  @ApiResponseProperty()
  width: number;

  @ApiResponseProperty()
  height: number;

  @ApiResponseProperty()
  depth: number;

  @ApiResponseProperty()
  weight: number;

  @ApiResponseProperty()
  receivedAt: Date;

  @ApiResponseProperty()
  expiryDate: Date;

  @ApiResponseProperty()
  isReserved: boolean;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;
}

export class BatchListDto {
  @ApiResponseProperty({ type: [BatchDto] })
  data: BatchDto[];

  @ApiResponseProperty()
  total: number;
}
