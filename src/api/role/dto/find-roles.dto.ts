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
import { FindRolesParams, RoleOrderColumn } from 'src/lib/types/roles';

export class FindRolesParamsDto implements FindRolesParams {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  name?: string;

  @IsInt()
  @IsPositive()
  @ApiProperty()
  page: number;

  @IsInt()
  @IsPositive()
  @ApiProperty()
  pageSize: number;

  @IsEnum(RoleOrderColumn)
  @IsOptional()
  @ApiPropertyOptional()
  orderBy: RoleOrderColumn = RoleOrderColumn.NAME;

  @IsEnum(Prisma.SortOrder)
  @IsOptional()
  @ApiPropertyOptional()
  orderDirection: Prisma.SortOrder = Prisma.SortOrder.asc;
}
