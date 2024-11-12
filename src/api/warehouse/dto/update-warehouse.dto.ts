import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { UpdateWarehouseData } from 'src/lib/types/warehouse';

export class UpdateWarehouseDTO implements UpdateWarehouseData {
  @ApiPropertyOptional({ description: 'The name of the warehouse' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'The type of the warehouse' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: 'The address of the warehouse' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Coordinates of the warehouse',
    required: false,
  })
  @IsOptional()
  @IsString()
  coordinates?: string;

  @ApiPropertyOptional({
    description: 'Notes about the warehouse',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'The area of the warehouse in square meters',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  area?: number;

  @ApiPropertyOptional({
    description: 'Whether the warehouse is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Photo URL of the warehouse',
    required: false,
  })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiPropertyOptional({
    description: 'Timestamp of last update',
    required: false,
  })
  updatedAt: Date = new Date();
}
