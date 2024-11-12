import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma, StatusEnum } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { FindUsersParams, UserOrderColumn } from 'src/lib/types/users';

export class FindUsersParamsDto implements FindUsersParams {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  lastName?: string;

  @IsEnum(StatusEnum)
  @IsOptional()
  @ApiPropertyOptional()
  status?: StatusEnum;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  roleId: string;

  @IsInt()
  @IsPositive()
  @ApiProperty({ default: 1, minimum: 1 })
  page: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({ default: 10, minimum: 1, maximum: 100 })
  pageSize: number;

  @IsEnum(UserOrderColumn)
  @IsOptional()
  @ApiPropertyOptional()
  orderBy: UserOrderColumn = UserOrderColumn.FIRST_NAME;

  @IsEnum(Prisma.SortOrder)
  @IsOptional()
  @ApiPropertyOptional({ enum: Prisma.SortOrder })
  orderDirection: Prisma.SortOrder = Prisma.SortOrder.asc;
}
