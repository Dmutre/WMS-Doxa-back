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
  @ApiProperty({ description: 'The name of the warehouse' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The type of the warehouse' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'The address of the warehouse' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Coordinates of the warehouse', required: false })
  @IsOptional()
  @IsString()
  coordinates?: string;

  @ApiProperty({ description: 'Notes about the warehouse', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'The area of the warehouse in square meters',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  area?: number;

  @ApiProperty({
    description: 'Whether the warehouse is active',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiProperty({ description: 'Photo URL of the warehouse', required: false })
  @IsOptional()
  @IsString()
  photo?: string;
}
