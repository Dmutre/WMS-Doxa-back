import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ShiftScheduleEntry, UpdateUserData } from 'src/lib/types/users';

export class ShiftScheduleEntryDto implements ShiftScheduleEntry {
  @IsInt()
  @Min(0)
  @Max(6)
  @IsNotEmpty()
  @ApiProperty()
  day: number;

  @IsString()
  @ApiProperty()
  start: string;

  @IsString()
  @ApiProperty()
  end: string;
}

export class UpdateUserDataDto implements UpdateUserData {
  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  firstName?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  lastName?: string;

  @IsOptional()
  @ApiPropertyOptional({ example: 'example@mail.com' })
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @ApiPropertyOptional({ example: '+380981122334' })
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsDate()
  birthDate?: Date;

  @IsOptional()
  @ApiPropertyOptional({ type: [ShiftScheduleEntryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShiftScheduleEntryDto)
  @ArrayMaxSize(7)
  shiftSchedule?: ShiftScheduleEntry[];
}