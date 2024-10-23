import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { PaginationOpts } from 'src/lib/types/common';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    params: Prisma.UserWhereInput,
    opts: PaginationOpts,
  ): Promise<{ data: User[]; total: number }> {
    const { page, pageSize } = opts;

    const data = await this.prisma.user.findMany({
      where: params,
      take: pageSize,
      skip: (page - 1) * pageSize,
      include: {
        role: true,
      },
    });

    const total = await this.prisma.user.count({
      where: params,
    });

    return {
      data,
      total,
    };
  }

  async findBy(params: Prisma.UserWhereInput): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: params,
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });
  }

  async findByOrThrow(params: Prisma.UserWhereInput): Promise<User> {
    const user = await this.findBy(params);

    if (!user) {
      throw new NotFoundException({
        message: `User not found`,
      });
    }

    return user;
  }

  async existsUser(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return !!user;
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({
      data,
    });
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
