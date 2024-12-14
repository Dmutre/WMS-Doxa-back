import { Test, TestingModule } from '@nestjs/testing';
import { ClsService } from 'nestjs-cls';
import { RoleOrderColumn } from '../../lib/types/roles';
import { AuthService } from '../auth/auth.service';
import { CreateRoleDataDto } from './dto/create-role';
import { FindRolesParamsDto } from './dto/find-roles.dto';
import { UpdateRoleDataDto } from './dto/update-role';
import { RoleConstroller } from './role.controller';
import { RoleService } from './role.service';

describe('RoleConstroller', () => {
  let roleController: RoleConstroller;
  let roleService: RoleService;

  const mockRoleWithPermissions = {
    id: 'role-id-1',
    name: 'Admin',
    permissions: ['CREATE_ITEM', 'UPDATE_ITEM'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRoleList = [
    mockRoleWithPermissions,
    { ...mockRoleWithPermissions, id: 'role-id-2' },
  ];

  const mockPermissionList = ['CREATE_ITEM', 'UPDATE_ITEM', 'DELETE_ITEM'];

  const mockRoleService = {
    findPerms: jest.fn(() => Promise.resolve(mockPermissionList)),
    findRoles: jest.fn(() =>
      Promise.resolve({ data: mockRoleList, total: mockRoleList.length }),
    ),
    findRole: jest.fn(() => Promise.resolve(mockRoleWithPermissions)),
    createRole: jest.fn(() => Promise.resolve(mockRoleWithPermissions)),
    updateRole: jest.fn((id: string, data: UpdateRoleDataDto) =>
      Promise.resolve({ ...mockRoleWithPermissions, ...data }),
    ),
    deleteRole: jest.fn((id: string) =>
      Promise.resolve({ message: `Role ${id} deleted successfully` }),
    ),
  };

  const mockAuthService = {
    validateUser: jest.fn(),
  };

  const mockClsService = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleConstroller],
      providers: [
        {
          provide: RoleService,
          useValue: mockRoleService,
        },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ClsService, useValue: mockClsService },
      ],
    }).compile();

    roleController = module.get<RoleConstroller>(RoleConstroller);
    roleService = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(roleController).toBeDefined();
  });

  describe('findPerms', () => {
    it('should return a list of permissions', async () => {
      const result = await roleController.findPerms();
      expect(result).toEqual(mockPermissionList);
      expect(roleService.findPerms).toHaveBeenCalled();
    });
  });

  describe('findRoles', () => {
    it('should return a list of roles', async () => {
      const params: FindRolesParamsDto = {
        page: 1,
        pageSize: 10,
        orderBy: RoleOrderColumn.CREATED_AT,
        orderDirection: 'asc',
      };
      const result = await roleController.findRoles(params);
      expect(result).toEqual({
        data: mockRoleList,
        total: mockRoleList.length,
      });
      expect(roleService.findRoles).toHaveBeenCalledWith(params);
    });
  });

  describe('findRole', () => {
    it('should return a role by ID', async () => {
      const result = await roleController.findRole('role-id-1');
      expect(result).toEqual(mockRoleWithPermissions);
      expect(roleService.findRole).toHaveBeenCalledWith('role-id-1');
    });
  });

  describe('createRole', () => {
    it('should create a new role', async () => {
      const createRoleDto: CreateRoleDataDto = {
        name: 'New Role',
        permissionIds: ['CREATE_ITEM'],
      };
      const result = await roleController.createRole(createRoleDto);
      expect(result).toEqual(mockRoleWithPermissions);
      expect(roleService.createRole).toHaveBeenCalledWith(createRoleDto);
    });
  });

  describe('updateRole', () => {
    it('should update a role by ID', async () => {
      const updateRoleDto: UpdateRoleDataDto = {
        name: 'Updated Role',
        permissionIds: [],
      };
      const result = await roleController.updateRole(
        'role-id-1',
        updateRoleDto,
      );
      expect(result).toEqual({ ...mockRoleWithPermissions, ...updateRoleDto });
      expect(roleService.updateRole).toHaveBeenCalledWith(
        'role-id-1',
        updateRoleDto,
      );
    });
  });

  describe('deleteRole', () => {
    it('should delete a role by ID', async () => {
      const result = await roleController.deleteRole('role-id-1');
      expect(result).toEqual({
        message: 'Role role-id-1 deleted successfully',
      });
      expect(roleService.deleteRole).toHaveBeenCalledWith('role-id-1');
    });
  });
});
