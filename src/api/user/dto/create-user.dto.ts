import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MaxLength,
  IsStrongPassword,
} from 'class-validator';
import { CreateUserData } from 'src/lib/types/users';

export class CreateUserDataDto implements CreateUserData {
  @ApiProperty({ description: "Ім'я користувача" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  firstName: string;

  @ApiProperty({ description: 'Прізвище користувача' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  lastName: string;

  @ApiProperty({ description: 'Потужний пароль користувача' })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @MaxLength(64)
  password: string;

  @ApiProperty({ description: 'ID ролі користувача' })
  @IsString()
  @IsNotEmpty()
  roleId: string;

  @ApiProperty({
    example: 'example@mail.com',
    description: 'Email користувача',
  })
  @IsEmail()
  @MaxLength(255)
  email: string;
}
