import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { FindRolesParams, RoleOrderColumn } from '../../../lib/types/roles';

export class FindRolesParamsDto implements FindRolesParams {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional({ description: 'Пошук за назвою ролі користувача' })
  name?: string;

  @IsInt()
  @IsPositive()
  @ApiProperty({ default: 1, minimum: 1 })
  page: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({ default: 10, minimum: 1, maximum: 100 })
  pageSize: number;

  @IsEnum(RoleOrderColumn)
  @IsOptional()
  @ApiPropertyOptional()
  orderBy: RoleOrderColumn = RoleOrderColumn.NAME;

  @IsEnum(Prisma.SortOrder)
  @IsOptional()
  @ApiPropertyOptional({ enum: Prisma.SortOrder })
  orderDirection: Prisma.SortOrder = Prisma.SortOrder.asc;
}
