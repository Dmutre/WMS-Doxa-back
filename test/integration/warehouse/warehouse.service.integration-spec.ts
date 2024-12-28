import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from 'src/api/role/role.service';
import { UserMapper } from 'src/api/user/user.mapper';
import { UserService } from 'src/api/user/user.service';
import { FindWarehousesParamsDTO } from 'src/api/warehouse/dto/find-warehouses.dto';
import { WarehouseService } from 'src/api/warehouse/warehouse.service';
import { PrismaService } from 'src/database/prisma.service';
import { WarehouseOrderColumn } from 'src/lib/types/warehouse';

const testWarehouses = [
  {
    id: 'warehouse1',
    name: 'Warehouse A',
    type: 'Storage',
    address: '123 Street, City',
    isActive: true,
  },
  {
    id: 'warehouse2',
    name: 'Warehouse B',
    type: 'Distribution',
    address: '456 Avenue, City',
    isActive: false,
  },
];

describe('WarehouseService (Integration)', () => {
  let warehouseService: WarehouseService;
  let prisma: PrismaService;
  let userService: UserService; // eslint-disable-line

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WarehouseService,
        PrismaService,
        UserService,
        UserMapper,
        RoleService,
      ],
    }).compile();

    warehouseService = module.get<WarehouseService>(WarehouseService);
    prisma = module.get<PrismaService>(PrismaService);
    userService = module.get<UserService>(UserService);

    await prisma.$connect();

    await prisma.user.deleteMany();

    await prisma.warehouse.createMany({ data: testWarehouses });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('createWarehouse', () => {
    it('should create a new warehouse', async () => {
      const createWarehouseDto = {
        name: 'New Warehouse',
        type: 'Storage',
        address: '789 Road, City',
        isActive: true,
      };

      const warehouse =
        await warehouseService.createWarehouse(createWarehouseDto);

      expect(warehouse).toBeDefined();
      expect(warehouse.name).toBe('New Warehouse');
      expect(warehouse.address).toBe('789 Road, City');
    });
  });

  describe('getWarehouseById', () => {
    it('should return a warehouse by ID', async () => {
      const warehouse = await warehouseService.getWarehouseById('warehouse1');

      expect(warehouse).toBeDefined();
      expect(warehouse.id).toBe('warehouse1');
    });

    it('should throw NotFoundException for invalid warehouse ID', async () => {
      await expect(
        warehouseService.getWarehouseById('invalid_id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateWarehouse', () => {
    it('should update an existing warehouse', async () => {
      const updateWarehouseDto = {
        name: 'Updated Warehouse A',
        isActive: false,
      };

      const updatedWarehouse = await warehouseService.updateWarehouse(
        'warehouse1',
        updateWarehouseDto,
      );

      expect(updatedWarehouse).toBeDefined();
      expect(updatedWarehouse.name).toBe('Updated Warehouse A');
      expect(updatedWarehouse.isActive).toBe(false);
    });
  });

  describe('deleteWarehouse', () => {
    it('should delete a warehouse by ID', async () => {
      const result = await warehouseService.deleteWarehouse('warehouse2');

      expect(result.message).toBe(
        'Warehouse with id warehouse2 deleted successfully',
      );

      await expect(
        warehouseService.getWarehouseById('warehouse2'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllWarehouses', () => {
    it('should return a paginated list of warehouses', async () => {
      const params: FindWarehousesParamsDTO = {
        isActive: true,
        page: 1,
        pageSize: 10,
        orderBy: WarehouseOrderColumn.CREATED_AT,
        orderDirection: 'asc',
      };

      const result = await warehouseService.getAllWarehouses(params);

      expect(result.data).toBeDefined();
      expect(result.total).toBeGreaterThanOrEqual(1);
    });
  });
});
