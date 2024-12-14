import {
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateRoleData,
  FindRolesParams,
  RoleOrderColumn,
} from '../../lib/types/roles';
import { RoleService } from './role.service';

describe('RoleService', () => {
  let roleService: RoleService;
  // eslint-disable-next-line
  let prismaService: PrismaService;

  const mockRole = {
    id: 'role-id-1',
    name: 'Admin',
    isPreset: true,
    permissions: [
      { permissionId: 'perm-id-1', permission: { name: 'CREATE_USER' } },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPermission = {
    id: 'perm-id-1',
    name: 'CREATE_USER',
  };

  const mockRoleRepo = {
    findMany: jest.fn(() => Promise.resolve([mockRole])),
    count: jest.fn(() => Promise.resolve(1)),
    findUnique: jest.fn(() => Promise.resolve(mockRole)),
    findFirst: jest.fn(() => Promise.resolve(mockRole)),
    create: jest.fn(() => Promise.resolve(mockRole)),
    update: jest.fn(() => Promise.resolve(mockRole)),
    delete: jest.fn(() => Promise.resolve(mockRole)),
  };

  const mockPermissionRepo = {
    findMany: jest.fn(() => Promise.resolve([mockPermission])),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: PrismaService,
          useValue: {
            role: mockRoleRepo,
            permission: mockPermissionRepo,
          },
        },
      ],
    }).compile();

    roleService = module.get<RoleService>(RoleService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(roleService).toBeDefined();
  });

  describe('findPerms', () => {
    it('should return a list of permissions', async () => {
      const result = await roleService.findPerms();
      expect(result).toEqual({ data: [mockPermission] });
      expect(mockPermissionRepo.findMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException if some permissions are not found', async () => {
      jest.spyOn(mockPermissionRepo, 'findMany').mockResolvedValueOnce([]);
      await expect(roleService.findPerms(['missing-perm-id'])).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findRoles', () => {
    it('should return a list of roles with total count', async () => {
      const params: FindRolesParams = {
        name: 'Admin',
        page: 1,
        pageSize: 10,
        orderBy: RoleOrderColumn.NAME,
        orderDirection: 'asc',
      };

      const result = await roleService.findRoles(params);
      expect(result).toEqual({ data: [mockRole], total: 1 });
      expect(mockRoleRepo.findMany).toHaveBeenCalledWith({
        where: { name: { contains: 'Admin' }, isPreset: true },
        orderBy: { name: 'asc' },
        skip: 0,
        take: 10,
        include: {
          permissions: {
            include: { permission: { select: { name: true } } },
            orderBy: { permission: { name: 'asc' } },
          },
        },
      });
    });
  });

  describe('findRole', () => {
    it('should return a role by ID', async () => {
      const result = await roleService.findRole('role-id-1');
      expect(result).toEqual(mockRole);
      expect(mockRoleRepo.findUnique).toHaveBeenCalledWith({
        where: { id: 'role-id-1' },
        include: {
          permissions: {
            include: { permission: { select: { name: true } } },
            orderBy: { permission: { name: 'asc' } },
          },
        },
      });
    });

    it('should throw NotFoundException if role is not found', async () => {
      jest.spyOn(mockRoleRepo, 'findUnique').mockResolvedValueOnce(null);
      await expect(roleService.findRole('role-id-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createRole', () => {
    it('should create a new role', async () => {
      const data: CreateRoleData = {
        name: 'New Role',
        permissionIds: ['perm-id-1'],
      };
      const result = roleService.createRole(data);
      expect(result).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteRole', () => {
    it('should delete a role', async () => {
      const result = await roleService.deleteRole('role-id-1');
      expect(result).toEqual({ message: 'Role deleted successfully' });
      expect(mockRoleRepo.delete).toHaveBeenCalledWith({
        where: { id: 'role-id-1', isPreset: true },
      });
    });

    it('should throw NotFoundException if role does not exist', async () => {
      jest.spyOn(mockRoleRepo, 'delete').mockRejectedValueOnce(new Error());
      await expect(roleService.deleteRole('role-id-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findSuperuserRole', () => {
    it('should return the superuser role', async () => {
      const result = await roleService.findSuperuserRole();
      expect(result).toEqual(mockRole);
      expect(mockRoleRepo.findFirst).toHaveBeenCalledWith({
        where: { name: 'Superuser', isPreset: true },
      });
    });

    it('should throw InternalServerErrorException if superuser role is not found', async () => {
      jest.spyOn(mockRoleRepo, 'findFirst').mockResolvedValueOnce(null);
      await expect(roleService.findSuperuserRole()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
