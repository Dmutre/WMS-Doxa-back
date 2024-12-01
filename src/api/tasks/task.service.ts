import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, TaskStatus } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/database/prisma.service';
import {
  CreateTaskData,
  FindTasksParams,
  UpdateTaskData,
} from 'src/lib/types/tasks';

@Injectable()
export class TaskService {
  private readonly taskRepo: Prisma.TaskDelegate;

  constructor(prisma: PrismaService) {
    this.taskRepo = prisma.task;
  }

  async findTasks(params: FindTasksParams) {
    const {
      searchTerm,
      code,
      status,
      priority,
      isOverdue,
      createdAtFrom,
      createdAtTo,
      dueDateFrom,
      dueDateTo,
      startDateFrom,
      startDateTo,
      assigneeId,
      reporterId,
      page,
      pageSize,
      orderBy,
      orderDirection,
    } = params;
    const where: Prisma.TaskWhereInput = {
      ...(searchTerm
        ? {
            OR: [
              { title: { contains: searchTerm } },
              { description: { contains: searchTerm } },
            ],
          }
        : {}),
      code: { startsWith: code },
      status,
      priority,
      isOverdue,
      createdAt: {
        gte: createdAtFrom,
        lte: createdAtTo,
      },
      dueDate: {
        gte: dueDateFrom,
        lte: dueDateTo,
      },
      startDate: {
        gte: startDateFrom,
        lte: startDateTo,
      },
      assigneeId,
      reporterId,
    };
    const [data, total] = await Promise.all([
      this.taskRepo.findMany({
        where,
        take: pageSize,
        skip: (page - 1) * pageSize,
        orderBy: {
          [orderBy]: orderDirection,
        },
        include: {
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          reporter: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      this.taskRepo.count({ where }),
    ]);
    return {
      data: data.map(({ description, spent, ...task }) => task),
      total,
    };
  }

  async findTask(id: string) {
    const task = await this.taskRepo.findUnique({
      where: { id },
      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        reporter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async createTask(data: CreateTaskData) {
    const { assigneeId, reporterId, ...payload } = data;
    if (
      payload.dueDate &&
      payload.startDate &&
      payload.dueDate <= payload.startDate
    )
      throw new BadRequestException('Due date must be greater than start date');
    const task = await this.taskRepo
      .create({
        data: {
          ...payload,
          isOverdue:
            payload.dueDate <= new Date() &&
            payload.status !== TaskStatus.DONE &&
            payload.status !== TaskStatus.CANCELED,
          ...(assigneeId ? { assignee: { connect: { id: assigneeId } } } : {}),
          ...(reporterId ? { reporter: { connect: { id: reporterId } } } : {}),
        },
        include: {
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          reporter: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      })
      .catch((error: PrismaClientKnownRequestError) => {
        // INFO: https://www.prisma.io/docs/orm/reference/error-reference#p2025
        if (error.code === 'P2025')
          throw new ConflictException('Assignee or reporter not found');
        throw error;
      });
    return task;
  }

  async updateTask(id: string, data: UpdateTaskData) {
    const { assigneeId, reporterId, ...payload } = data;
    const task = await this.findTask(id).then((task) => ({
      ...task,
      ...payload,
    }));
    if (task.dueDate && task.startDate && task.dueDate <= task.startDate)
      throw new BadRequestException('Due date must be greater than start date');
    const updatedTask = await this.taskRepo
      .update({
        where: { id },
        data: {
          ...payload,
          isOverdue:
            task.dueDate <= new Date() &&
            task.status !== TaskStatus.DONE &&
            task.status !== TaskStatus.CANCELED,
          assignee: {
            ...(assigneeId === null
              ? { disconnect: true }
              : assigneeId
                ? { connect: { id: assigneeId } }
                : {}),
          },
          reporter: {
            ...(reporterId === null
              ? { disconnect: true }
              : reporterId
                ? { connect: { id: reporterId } }
                : {}),
          },
        },
        include: {
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          reporter: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      })
      .catch((error: PrismaClientKnownRequestError) => {
        // INFO: https://www.prisma.io/docs/orm/reference/error-reference#p2025
        if (error.code === 'P2025')
          throw new ConflictException('Assignee or reporter not found');
        throw error;
      });
    return updatedTask;
  }

  async deleteTask(id: string) {
    try {
      await this.taskRepo.delete({
        where: {
          id,
        },
      });
      return {
        message: 'Task deleted successfully',
      };
    } catch {
      throw new NotFoundException('Task not found');
    }
  }
}
