import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ChangeRoleData } from 'src/lib/types/users';

export class ChangeRoleDataDto implements ChangeRoleData {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  roleId: string;
}
