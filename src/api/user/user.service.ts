import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, StatusEnum } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { FindUsersParams } from 'src/lib/types/users';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserService {
  private readonly userRepo: Prisma.UserDelegate;

  constructor(
    prisma: PrismaService,
    private readonly userMapper: UserMapper,
  ) {
    this.userRepo = prisma.user;
  }

  async findUsers(params: FindUsersParams) {
    const {
      email,
      firstName,
      lastName,
      status,
      roleId,
      page,
      pageSize,
      orderBy,
      orderDirection,
    } = params;

    const where = {
      email: { contains: email },
      firstName: { contains: firstName },
      lastName: { contains: lastName },
      status,
      roleId,
    };

    const users = await this.userRepo.findMany({
      where,
      orderBy: {
        [orderBy]: orderDirection,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        role: true,
      },
    });

    const total = await this.userRepo.count({ where });

    return {
      data: users.map((user) => this.userMapper.map(user)),
      total,
    };
  }

  async findUser(id: string) {
    const user = await this.userRepo.findFirst({
      where: { id },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return this.userMapper.map(user);
  }

  async fireUser(id: string) {
    const user = await this.findUser(id);

    if (user.status === StatusEnum.FIRED)
      throw new BadRequestException('User is already fired');

    const firedUser = await this.userRepo.update({
      where: { id },
      data: { status: StatusEnum.FIRED },
    });

    return firedUser;
  }
}
