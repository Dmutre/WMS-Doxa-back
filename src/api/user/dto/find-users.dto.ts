import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma, StatusEnum } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { FindUsersParams, UserOrderColumn } from 'src/lib/types/users';

export class FindUsersParamsDto implements FindUsersParams {
  @IsEmail()
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
  @ApiProperty()
  page: number;

  @IsInt()
  @IsPositive()
  @ApiProperty()
  pageSize: number;

  @IsEnum(UserOrderColumn)
  @IsOptional()
  @ApiPropertyOptional()
  orderBy: UserOrderColumn = UserOrderColumn.FIRST_NAME;

  @IsEnum(Prisma.SortOrder)
  @IsOptional()
  @ApiPropertyOptional()
  orderDirection: Prisma.SortOrder = Prisma.SortOrder.asc;
}
