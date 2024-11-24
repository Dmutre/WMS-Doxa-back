import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { UpdateRoleData } from 'src/lib/types/roles';
import { CreateRoleDataDto } from './create-role';

export class UpdateRoleDataDto
  extends CreateRoleDataDto
  implements UpdateRoleData
{
  @IsOptional()
  @ApiPropertyOptional({ description: 'Назва ролі' })
  name: string;

  @IsOptional()
  @ApiPropertyOptional()
  permissionIds: string[];
}
