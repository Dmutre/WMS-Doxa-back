import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, StatusEnum } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import {
  ChangeRoleData,
  CreateSuperUserData,
  CreateUserData,
  FindUsersParams,
  UpdateUserData,
  UserCredentials,
} from 'src/lib/types/users';
import { hashPassword } from 'src/lib/utils/crypto';
import { RoleService } from '../role/role.service';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly userRepo: Prisma.UserDelegate;

  constructor(
    prisma: PrismaService,
    private readonly userMapper: UserMapper,
    private readonly roleService: RoleService,
  ) {
    this.userRepo = prisma.user;
  }

  private async existsUser(email: string) {
    const user = await this.userRepo.findFirst({ where: { email } });
    return !!user;
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
    const [users, total] = await Promise.all([
      this.userRepo.findMany({
        where,
        orderBy: {
          [orderBy]: orderDirection,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          role: true,
        },
      }),
      this.userRepo.count({ where }),
    ]);
    return {
      data: users.map((user) => this.userMapper.map(user)),
      total,
    };
  }

  async findUser(id: string) {
    const user = await this.userRepo.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return this.userMapper.map(user);
  }

  async findUserCredentials(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<UserCredentials> {
    const creds = await this.userRepo.findUnique({
      where,
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
    return creds;
  }

  async fireUser(id: string) {
    const user = await this.findUser(id);
    if (user.status === StatusEnum.FIRED)
      throw new BadRequestException('User is already fired');
    const firedUser = await this.userRepo.update({
      where: { id },
      data: { status: StatusEnum.FIRED },
      include: {
        role: true,
      },
    });
    return this.userMapper.map(firedUser);
  }

  async restoreUser(id: string) {
    const user = await this.findUser(id);
    if (user.status !== StatusEnum.FIRED)
      throw new BadRequestException('User is not fired');
    const restoredUser = await this.userRepo.update({
      where: { id },
      data: { status: StatusEnum.ACTIVE },
      include: {
        role: true,
      },
    });
    return this.userMapper.map(restoredUser);
  }

  async changeRole(id: string, data: ChangeRoleData) {
    const { roleId } = data;
    const user = await this.findUser(id);
    const curRole = user.role;
    const newRole = await this.roleService.forkRole(roleId);
    const updatedUser = await this.userRepo.update({
      where: { id },
      data: { role: { connect: { id: newRole.id } } },
      include: {
        role: true,
      },
    });
    await this.roleService.deleteRole(curRole.id, false).catch(() => {
      this.logger.warn({
        message: 'Skipped changed role cleanup. Role cannot be deleted',
        context: {
          userId: id,
          curRoleId: curRole.id,
          newRoleId: newRole.id,
        },
      });
    });
    return this.userMapper.map(updatedUser);
  }

  async createUser(data: CreateUserData) {
    const { roleId, ...userData } = data;
    const exists = await this.existsUser(userData.email);
    if (exists) throw new BadRequestException('Email is already taken');
    const role = await this.roleService.forkRole(roleId);
    const hashedPassword = await hashPassword(userData.password);
    const user = await this.userRepo.create({
      data: {
        ...userData,
        password: hashedPassword,
        role: { connect: { id: role.id } },
      },
      include: {
        role: true,
      },
    });
    return this.userMapper.map(user);
  }

  async updateUser(id: string, data: UpdateUserData) {
    const { email, shiftSchedule, ...userData } = data;
    if (email) {
      const exists = await this.existsUser(email);
      if (exists) throw new BadRequestException('Email is already taken');
    }
    const updatedUser = await this.userRepo.update({
      where: { id },
      data: {
        ...userData,
        shiftSchedule: shiftSchedule && JSON.stringify(shiftSchedule),
      },
      include: {
        role: true,
      },
    });
    return this.userMapper.map(updatedUser);
  }

  async createSuperUser(data: CreateSuperUserData) {
    const role = await this.roleService.findSuperuserRole();
    await this.createUser({ ...data, roleId: role.id });
  }
}
