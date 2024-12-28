import { ApiResponseProperty } from '@nestjs/swagger';

export class ItemDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  sku: string;

  @ApiResponseProperty()
  description: string;

  @ApiResponseProperty()
  barcode: string;

  @ApiResponseProperty()
  weight: number;

  @ApiResponseProperty()
  dimensions: string;

  @ApiResponseProperty()
  category: string;

  @ApiResponseProperty()
  manufacturer: string;

  @ApiResponseProperty()
  expirationDate: Date | null;

  @ApiResponseProperty()
  warrantyPeriod: number | null;

  @ApiResponseProperty()
  originCountry: string;

  @ApiResponseProperty({ type: [String] })
  photoUrl: string[];

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;
}

export class ItemListDto {
  @ApiResponseProperty({ type: [ItemDto] })
  data: ItemDto[];

  @ApiResponseProperty()
  total: number;
}
