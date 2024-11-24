import { ApiResponseProperty } from '@nestjs/swagger';
import { Action } from 'src/lib/types/journal/user-action';

export class UserActionUserDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  firstName: string;

  @ApiResponseProperty()
  lastName: string;
}

export class UserActionDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  userId: string;

  @ApiResponseProperty({ type: 'object' })
  payload: Record<string, unknown>;

  @ApiResponseProperty({ enum: Action })
  action: Action;

  @ApiResponseProperty()
  ip: string;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty({ type: UserActionUserDto })
  user: UserActionUserDto;
}

export class UserActionListDto {
  @ApiResponseProperty({ type: [UserActionDto] })
  data: UserActionDto[];

  @ApiResponseProperty()
  total: number;
}
