import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.RoleUncheckedCreateInput) {
    return await this.prisma.role.create({ data });
  }

  async findBy(params: Prisma.RoleWhereInput): Promise<Role | null> {
    return await this.prisma.role.findFirst({
      where: params,
      include: {
        permissions: true,
      },
    });
  }
}
