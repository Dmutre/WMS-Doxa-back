import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { $Enums, Prisma, Role, User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import {
  CreateUserData,
  UpdateUserData,
  UserOrderColumn,
} from 'src/lib/types/users';
import { RoleService } from '../role/role.service';
import { UserMapper } from './user.mapper';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  const mockRole: Role = {
    id: 'role-id-1',
    name: 'Admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    isPreset: false,
  };

  const mockUser: User & { role: Role } = {
    id: 'user-id-1',
    roleId: 'role-id-1',
    firstName: 'John',
    lastName: 'Doe',
    password: 'password',
    email: 'johndoe@mail.com',
    status: $Enums.StatusEnum.ACTIVE,
    phone: null,
    birthDate: null,
    shiftSchedule: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    role: mockRole,
  };

  const mockPrismaService = {
    user: {
      create: jest.fn(() => Promise.resolve(mockUser)),
      findUnique: jest.fn(() => Promise.resolve(mockUser)),
      findFirst: jest.fn(() => Promise.resolve(null)),
      update: jest.fn(() => Promise.resolve(mockUser)),
      delete: jest.fn(() => Promise.resolve(mockUser)),
      findMany: jest.fn(() => Promise.resolve([mockUser])),
      count: jest.fn(() => Promise.resolve(1)),
    },
  };

  const mockRoleService = {
    forkRole: jest.fn(() => Promise.resolve(mockRole)),
    deleteRole: jest.fn(() => Promise.resolve()),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserMapper,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RoleService, useValue: mockRoleService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    const createUserDto: CreateUserData = {
      firstName: 'John',
      lastName: 'Doe',
      password: 'password',
      roleId: 'role-id-1',
      email: 'johndoe@mail.com',
    };

    it('should create a user', async () => {
      const result = await userService.createUser(createUserDto);
      expect(result).toBeDefined();
      expect(prismaService.user.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if user with email already exists', async () => {
      jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValueOnce(mockUser);

      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findUser', () => {
    it('should return user by id', async () => {
      const result = await userService.findUser('user-id-1');
      expect(result).toBeDefined();
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-id-1' },
        include: {
          role: true,
        },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null);

      await expect(userService.findUser('user-id-2')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should not include user password in the response', async () => {
      const result = await userService.findUser('user-id-1');
      expect(result['password']).toBeUndefined();
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserData = {
        firstName: 'Jane',
        lastName: 'Doe',
      };

      const result = await userService.updateUser('user-id-1', updateUserDto);
      expect(result).toBeDefined();
      expect(prismaService.user.update).toHaveBeenCalled();
    });
  });

  describe('fireUser', () => {
    it('should fire user', async () => {
      const result = await userService.fireUser('user-id-1');
      expect(result).toBeDefined();
      expect(prismaService.user.update).toHaveBeenCalled();
    });
  });

  describe('restoreUser', () => {
    it('should restore user', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce({
        ...mockUser,
        status: $Enums.StatusEnum.FIRED,
      });
      const result = await userService.restoreUser('user-id-1');
      expect(result).toBeDefined();
      expect(prismaService.user.update).toHaveBeenCalled();
    });

    it('should throw BadRequestException if user is not fired', async () => {
      await expect(userService.restoreUser('user-id-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('changeRole', () => {
    const changeRoleData = { roleId: 'new-role-id' };

    it('should change user role', async () => {
      const result = await userService.changeRole('user-id-1', changeRoleData);
      expect(result).toBeDefined();
      expect(prismaService.user.update).toHaveBeenCalled();
      expect(mockRoleService.forkRole).toHaveBeenCalledWith('new-role-id');
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null);

      await expect(
        userService.changeRole('user-id-2', changeRoleData),
      ).rejects.toThrow(NotFoundException);
    });

    it('should log a warning if role deletion fails', async () => {
      jest
        .spyOn(mockRoleService, 'deleteRole')
        .mockRejectedValueOnce(new Error('Role deletion failed'));
      const loggerSpy = jest.spyOn(userService['logger'], 'warn');

      await userService.changeRole('user-id-1', changeRoleData);
      expect(loggerSpy).toHaveBeenCalled();
    });
  });

  describe('findUsers', () => {
    it('should return a list of users', async () => {
      const findUsersParams = {
        email: 'johndoe@mail.com',
        firstName: 'John',
        lastName: 'Doe',
        status: $Enums.StatusEnum.ACTIVE,
        roleId: 'role-id-1',
        page: 1,
        pageSize: 10,
        orderBy: UserOrderColumn.CREATED_AT,
        orderDirection: Prisma.SortOrder.asc,
      };

      const result = await userService.findUsers(findUsersParams);
      expect(result).toBeDefined();
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        where: {
          email: { contains: 'johndoe@mail.com' },
          firstName: { contains: 'John' },
          lastName: { contains: 'Doe' },
          status: $Enums.StatusEnum.ACTIVE,
          roleId: 'role-id-1',
        },
        orderBy: {
          createdAt: 'asc',
        },
        skip: 0,
        take: 10,
        include: {
          role: true,
        },
      });
      expect(prismaService.user.count).toHaveBeenCalledWith({
        where: {
          email: { contains: 'johndoe@mail.com' },
          firstName: { contains: 'John' },
          lastName: { contains: 'Doe' },
          status: $Enums.StatusEnum.ACTIVE,
          roleId: 'role-id-1',
        },
      });
    });

    it('should return an empty list if no users found', async () => {
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValueOnce([]);
      jest.spyOn(prismaService.user, 'count').mockResolvedValueOnce(0);

      const findUsersParams = {
        email: 'nonexistent@mail.com',
        firstName: 'Nonexistent',
        lastName: 'User',
        status: $Enums.StatusEnum.ACTIVE,
        roleId: 'role-id-1',
        page: 1,
        pageSize: 10,
        orderBy: UserOrderColumn.CREATED_AT,
        orderDirection: Prisma.SortOrder.asc,
      };

      const result = await userService.findUsers(findUsersParams);
      expect(result).toBeDefined();
      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });
});
