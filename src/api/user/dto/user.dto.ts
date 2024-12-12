import { ApiResponseProperty } from '@nestjs/swagger';
import { StatusEnum } from '@prisma/client';
import { RoleDto } from '../../../api/role/dto/role.dto';
import { ShiftScheduleEntry } from '../../../lib/types/users';

export class ShiftScheduleEntryDto {
  @ApiResponseProperty()
  day: number;

  @ApiResponseProperty({ format: 'date-time' })
  start: string;

  @ApiResponseProperty({ format: 'date-time' })
  end: string;
}

export class UserDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  roleId: string;

  @ApiResponseProperty()
  firstName: string;

  @ApiResponseProperty()
  lastName: string;

  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty({ enum: StatusEnum })
  status: StatusEnum;

  @ApiResponseProperty()
  phone: string | null;

  @ApiResponseProperty()
  birthDate: Date | null;

  @ApiResponseProperty({
    type: [ShiftScheduleEntryDto],
  })
  shiftSchedule: ShiftScheduleEntry[] | null;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;

  @ApiResponseProperty({ type: RoleDto })
  role: RoleDto;
}

export class UserListDto {
  @ApiResponseProperty({ type: [UserDto] })
  data: UserDto[];

  @ApiResponseProperty()
  total: number;
}
