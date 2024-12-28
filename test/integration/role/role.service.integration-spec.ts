import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { RoleService } from 'src/api/role/role.service';
import { PrismaService } from 'src/database/prisma.service';
import { FindRolesParams, RoleOrderColumn } from 'src/lib/types/roles';

const testPermissions: Prisma.PermissionCreateManyInput[] = [
  { id: 'perm1', name: 'PERM_1' },
  { id: 'perm2', name: 'PERM_2' },
];

const testRoles: Prisma.RoleCreateManyInput[] = [
  { id: 'role1', name: 'Role 1', isPreset: true },
  { id: 'role2', name: 'Role 2', isPreset: true },
];

describe('RoleService (Integration)', () => {
  let roleService: RoleService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleService, PrismaService],
    }).compile();

    roleService = module.get<RoleService>(RoleService);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.$connect();

    // Очистка бази даних
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();
    await prisma.permission.deleteMany();

    // Додавання тестових даних
    await prisma.permission.createMany({ data: testPermissions });
    await prisma.role.createMany({ data: testRoles });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('findPerms', () => {
    it('should return all permissions', async () => {
      const result = await roleService.findPerms();
      expect(result.data).toHaveLength(testPermissions.length);
    });

    it('should throw NotFoundException for invalid permission IDs', async () => {
      await expect(roleService.findPerms(['invalid_id'])).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findRoles', () => {
    it('should return a paginated list of roles', async () => {
      const params: FindRolesParams = {
        name: '',
        page: 1,
        pageSize: 10,
        orderBy: RoleOrderColumn.CREATED_AT,
        orderDirection: 'asc',
      };

      const result = await roleService.findRoles(params);

      expect(result.data).toHaveLength(testRoles.length);
      expect(result.total).toBe(testRoles.length);
    });
  });

  describe('findRole', () => {
    it('should return a role by ID', async () => {
      const role = await roleService.findRole('role1');
      expect(role).toBeDefined();
      expect(role.id).toBe('role1');
    });

    it('should throw NotFoundException for invalid role ID', async () => {
      await expect(roleService.findRole('invalid_id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createRole', () => {
    it('should create a new role with permissions', async () => {
      const createRoleData = {
        name: 'New Role',
        permissionIds: ['perm1', 'perm2'],
      };

      const role = await roleService.createRole(createRoleData);

      expect(role).toBeDefined();
      expect(role.name).toBe('New Role');
      expect(role.permissions).toHaveLength(2);
    });

    it('should throw BadRequestException if role name already exists', async () => {
      const createRoleData = {
        name: 'Role 1',
        permissionIds: [],
      };

      await expect(roleService.createRole(createRoleData)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateRole', () => {
    it('should update a role name and permissions', async () => {
      const updateRoleData = {
        name: 'Updated Role',
        permissionIds: ['perm1'],
      };

      const updatedRole = await roleService.updateRole('role1', updateRoleData);

      expect(updatedRole.name).toBe('Updated Role');
      expect(updatedRole.permissions).toHaveLength(1);
    });
  });

  describe('deleteRole', () => {
    it('should delete a role by ID', async () => {
      const result = await roleService.deleteRole('role2');
      expect(result.message).toBe('Role deleted successfully');

      await expect(roleService.findRole('role2')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
