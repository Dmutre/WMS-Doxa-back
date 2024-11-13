import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import {
  CreateUserActionData,
  FindUserActionsParams,
} from 'src/lib/types/journal/user-action';

@Injectable()
export class JournalService {
  private readonly userActionRepo: Prisma.UserActionDelegate;

  constructor(prisma: PrismaService) {
    this.userActionRepo = prisma.userAction;
  }

  async findUserActions(params: FindUserActionsParams) {
    const {
      ip,
      userId,
      createdAtFrom,
      createdAtTo,
      action,
      page,
      pageSize,
      orderBy,
      orderDirection,
    } = params;
    const where: Prisma.UserActionWhereInput = {
      ip: { contains: ip },
      userId,
      createdAt: {
        gte: createdAtFrom,
        lte: createdAtTo,
      },
      action,
    };
    const [userActions, total] = await Promise.all([
      this.userActionRepo.findMany({
        where,
        orderBy: {
          [orderBy]: orderDirection,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      this.userActionRepo.count({ where }),
    ]);
    return {
      data: userActions,
      total,
    };
  }

  async createUserAction(data: CreateUserActionData) {
    return await this.userActionRepo.create({ data });
  }
}
