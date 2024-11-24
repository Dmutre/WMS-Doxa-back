import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import {
  Action,
  FindUserActionsParams,
  UserActionOrderColumn,
} from 'src/lib/types/journal/user-action';

export class FindUserActionsParamsDto implements FindUserActionsParams {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({ description: 'IP адрес користувача' })
  ip?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({ description: 'ID користувача' })
  userId?: string;

  @IsDate()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Дата від здійснення дії' })
  createdAtFrom?: Date;

  @IsDate()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Дата до здійснення дії' })
  createdAtTo?: Date;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Здійснена дія', enum: Action })
  action?: Action;

  @IsInt()
  @IsPositive()
  @ApiProperty({ default: 1, minimum: 1 })
  page: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({ default: 10, minimum: 1, maximum: 100 })
  pageSize: number;

  @IsEnum(UserActionOrderColumn)
  @IsOptional()
  @ApiPropertyOptional()
  orderBy: UserActionOrderColumn = UserActionOrderColumn.CREATED_AT;

  @IsEnum(Prisma.SortOrder)
  @IsOptional()
  @ApiPropertyOptional({ enum: Prisma.SortOrder })
  orderDirection: Prisma.SortOrder = Prisma.SortOrder.desc;
}
