import { ApiResponseProperty } from '@nestjs/swagger';
import { StatusEnum } from '@prisma/client';

export class TaskUserDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  firstName: string;

  @ApiResponseProperty()
  lastName: string;
}

export class TaskDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  code: string;

  @ApiResponseProperty()
  title: string;

  @ApiResponseProperty()
  isOverdue: boolean;

  @ApiResponseProperty()
  priority: number | null;

  @ApiResponseProperty()
  estimate: number | null;

  @ApiResponseProperty()
  startDate: Date | null;

  @ApiResponseProperty()
  dueDate: Date | null;

  @ApiResponseProperty({ enum: StatusEnum })
  status: StatusEnum;

  @ApiResponseProperty()
  assigneeId: string | null;

  @ApiResponseProperty()
  reporterId: string | null;

  @ApiResponseProperty()
  assignee: TaskUserDto | null;

  @ApiResponseProperty()
  reporter: TaskUserDto | null;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;
}

export class TaskListDto {
  @ApiResponseProperty({ type: [TaskDto] })
  data: TaskDto[];

  @ApiResponseProperty()
  total: number;
}

export class TaskWithDetailsDto extends TaskDto {
  @ApiResponseProperty()
  description: string | null;

  @ApiResponseProperty()
  spent: number | null;
}
