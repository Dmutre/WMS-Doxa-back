import { ApiResponseProperty } from '@nestjs/swagger';

export class WerehouseDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  type: string;

  @ApiResponseProperty()
  address: string;

  @ApiResponseProperty()
  coordinates: string;

  @ApiResponseProperty()
  notes: string;

  @ApiResponseProperty()
  area: number;

  @ApiResponseProperty()
  isActive: boolean;

  @ApiResponseProperty()
  photo: string;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;
}

export class WerehouseListDto {
  @ApiResponseProperty({ type: [WerehouseDto] })
  data: WerehouseDto[];

  @ApiResponseProperty()
  total: number;
}
