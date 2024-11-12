import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ConnectUserToWarehouseData } from 'src/lib/types/warehouse';

export class ConnectUserToWarehouseDTO implements ConnectUserToWarehouseData {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  warehouseId: string;
}
