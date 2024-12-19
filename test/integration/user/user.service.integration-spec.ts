import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { Prisma, StatusEnum } from '@prisma/client';
import { RoleService } from 'src/api/role/role.service';
import { UserMapper } from 'src/api/user/user.mapper';
import { UserService } from 'src/api/user/user.service';
import { PrismaService } from 'src/database/prisma.service';

const testUsers: Prisma.UserCreateManyInput[] = [
  {
    id: 'user1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'hashedpassword',
    roleId: 'role1',
    status: StatusEnum.ACTIVE,
  },
  {
    id: 'user2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    password: 'hashedpassword',
    roleId: 'role2',
    status: StatusEnum.FIRED,
  },
];

describe('UserService (Integration)', () => {
  let userService: UserService;
  let prisma: PrismaService;
  let roleService: RoleService; // eslint-disable-line
  let userMapper: UserMapper; // eslint-disable-line

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService, RoleService, UserMapper],
    }).compile();

    userService = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
    roleService = module.get<RoleService>(RoleService);
    userMapper = module.get<UserMapper>(UserMapper);

    await prisma.$connect();

    // Очистка бази даних
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();

    // Додавання тестових ролей
    await prisma.role.createMany({
      data: [
        { id: 'role1', name: 'Admin', isPreset: true },
        { id: 'role2', name: 'Employee', isPreset: true },
      ],
    });

    // Додавання тестових користувачів
    await prisma.user.createMany({ data: testUsers });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('findUser', () => {
    it('should return a user by ID', async () => {
      const user = await userService.findUser('user1');
      expect(user).toBeDefined();
      expect(user.id).toBe('user1');
    });

    it('should throw NotFoundException for invalid user ID', async () => {
      await expect(userService.findUser('invalid_id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        firstName: 'Alice',
        lastName: 'Brown',
        email: 'alice.brown@example.com',
        password: 'StrongPassword1!',
        roleId: 'role1',
      };

      const user = await userService.createUser(createUserDto);

      expect(user).toBeDefined();
      expect(user.email).toBe('alice.brown@example.com');
    });

    it('should throw BadRequestException if email already exists', async () => {
      const createUserDto = {
        firstName: 'Duplicate',
        lastName: 'User',
        email: 'john.doe@example.com',
        password: 'StrongPassword1!',
        roleId: 'role1',
      };

      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const updateUserDto = {
        firstName: 'UpdatedName',
        lastName: 'UpdatedLastName',
      };

      const updatedUser = await userService.updateUser('user1', updateUserDto);

      expect(updatedUser).toBeDefined();
      expect(updatedUser.firstName).toBe('UpdatedName');
      expect(updatedUser.lastName).toBe('UpdatedLastName');
    });
  });

  describe('fireUser', () => {
    it('should change the status of a user to FIRED', async () => {
      const firedUser = await userService.fireUser('user1');
      expect(firedUser.status).toBe(StatusEnum.FIRED);
    });

    it('should throw BadRequestException if user is already fired', async () => {
      await expect(userService.fireUser('user2')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('restoreUser', () => {
    it('should change the status of a user to ACTIVE', async () => {
      const restoredUser = await userService.restoreUser('user2');
      expect(restoredUser.status).toBe(StatusEnum.ACTIVE);
    });

    it('should throw BadRequestException if user is not fired', async () => {
      await expect(userService.restoreUser('user1')).resolves.not.toThrow(
        BadRequestException,
      );
    });
  });
});
