import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserAction } from 'src/lib/core/decorators/user-action.decorator';
import { AuthPermissions } from 'src/lib/core/security/decorators/auth-permission';
import { Permissions } from 'src/lib/types/auth/permission';
import { Action } from 'src/lib/types/journal/user-action';
import { CreateTaskDataDto } from './dto/create-task.dto';
import { FindTasksParamsDto } from './dto/find-tasks.dto';
import { TaskListDto, TaskWithDetailsDto } from './dto/task.dto';
import { UpdateTaskDataDto } from './dto/update-task.dto';
import { TaskService } from './task.service';

@Controller('tasks')
@ApiTags('Tasks')
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UserAction(Action.FIND_TASKS)
  @AuthPermissions([Permissions.FIND_TASK])
  @Get()
  @ApiOperation({ summary: 'Find list of tasks' })
  @ApiOkResponse({ type: TaskListDto })
  async findTasks(@Query() params: FindTasksParamsDto) {
    return await this.taskService.findTasks(params);
  }

  @UserAction(Action.FIND_TASK)
  @AuthPermissions([Permissions.FIND_TASK])
  @Get(':id')
  @ApiOperation({ summary: 'Find task by id' })
  @ApiOkResponse({ type: TaskWithDetailsDto })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
  })
  async findTask(@Param('id') id: string) {
    return await this.taskService.findTask(id);
  }

  @UserAction(Action.CREATE_TASK)
  @AuthPermissions([Permissions.CREATE_TASK])
  @Post()
  @ApiOperation({ summary: 'Create new task' })
  @ApiResponse({
    status: 201,
    type: TaskWithDetailsDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Due date must be greater than start date',
  })
  @ApiResponse({
    status: 409,
    description: 'Assignee or reporter not found',
  })
  async createTask(@Body() data: CreateTaskDataDto) {
    return await this.taskService.createTask(data);
  }

  @UserAction(Action.UPDATE_TASK)
  @AuthPermissions([Permissions.UPDATE_TASK])
  @Put(':id')
  @ApiOperation({ summary: 'Update task by id' })
  @ApiOkResponse({
    type: TaskWithDetailsDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Due date must be greater than start date',
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Assignee or reporter not found',
  })
  async updateTask(@Param('id') id: string, @Body() data: UpdateTaskDataDto) {
    return await this.taskService.updateTask(id, data);
  }

  @UserAction(Action.DELETE_TASK)
  @AuthPermissions([Permissions.DELETE_TASK])
  @Delete(':id')
  @ApiOperation({ summary: 'Delete task by id' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
  })
  async deleteTask(@Param('id') id: string) {
    return await this.taskService.deleteTask(id);
  }
}
