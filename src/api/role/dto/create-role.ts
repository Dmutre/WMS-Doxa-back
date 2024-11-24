import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateRoleData } from 'src/lib/types/roles';

export class CreateRoleDataDto implements CreateRoleData {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Назва ролі користувача' })
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ApiProperty()
  permissionIds: string[];
}
