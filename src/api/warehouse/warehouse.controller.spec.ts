import { Test, TestingModule } from '@nestjs/testing';
import { Warehouse } from '@prisma/client';
import { ClsService } from 'nestjs-cls';
import { WarehouseOrderColumn } from '../../lib/types/warehouse';
import { AuthService } from '../auth/auth.service';
import { ConnectUserToWarehouseDTO } from './dto/connect-user.to-warehouse.dto';
import { CreateWarehouseDTO } from './dto/create-warehouse.dto';
import { FindWarehousesParamsDTO } from './dto/find-warehouses.dto';
import { UpdateWarehouseDTO } from './dto/update-warehouse.dto';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';

describe('WarehouseController', () => {
  let warehouseController: WarehouseController;
  let warehouseService: WarehouseService;
  let clsService: ClsService;

  const mockWarehouse: Warehouse = {
    id: 'warehouse-id-1',
    name: 'Test Warehouse',
    type: 'Storage',
    address: '123 Test St',
    coordinates: '0,0',
    notes: 'Test notes',
    area: 1000,
    isActive: true,
    photo: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockWarehouseList = [
    mockWarehouse,
    { ...mockWarehouse, id: 'warehouse-id-2' },
  ];

  const mockWarehouseService = {
    createWarehouse: jest.fn(() => Promise.resolve(mockWarehouse)),
    getWarehouseById: jest.fn(() => Promise.resolve(mockWarehouse)),
    updateWarehouse: jest.fn(() => Promise.resolve(mockWarehouse)),
    deleteWarehouse: jest.fn(() =>
      Promise.resolve({ message: 'Warehouse deleted successfully' }),
    ),
    getAllWarehouses: jest.fn(() =>
      Promise.resolve({
        data: mockWarehouseList,
        total: mockWarehouseList.length,
      }),
    ),
    connectUserToWarehouse: jest.fn(() =>
      Promise.resolve({ userId: 'user-id-1', warehouseId: 'warehouse-id-1' }),
    ),
    getWarehousesForUser: jest.fn(() => Promise.resolve(mockWarehouseList)),
  };

  const mockAuthService = {
    validateUser: jest.fn(),
  };

  const mockClsService = {
    get: jest.fn((key: string) =>
      key === 'user.id' ? 'user-id-1' : undefined,
    ),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WarehouseController],
      providers: [
        { provide: WarehouseService, useValue: mockWarehouseService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ClsService, useValue: mockClsService },
      ],
    }).compile();

    warehouseController = module.get<WarehouseController>(WarehouseController);
    warehouseService = module.get<WarehouseService>(WarehouseService);
    clsService = module.get<ClsService>(ClsService);
  });

  it('should be defined', () => {
    expect(warehouseController).toBeDefined();
  });

  describe('createWarehouse', () => {
    it('should create a new warehouse', async () => {
      const createWarehouseDto: CreateWarehouseDTO = {
        name: 'New Warehouse',
        type: 'Storage',
        address: '123 Test St',
        area: 2000,
      };

      const result =
        await warehouseController.createWarehouse(createWarehouseDto);
      expect(result).toEqual(mockWarehouse);
      expect(warehouseService.createWarehouse).toHaveBeenCalledWith(
        createWarehouseDto,
      );
    });
  });

  describe('getWarehouseById', () => {
    it('should return a warehouse by ID', async () => {
      const result =
        await warehouseController.getWarehouseById('warehouse-id-1');
      expect(result).toEqual(mockWarehouse);
      expect(warehouseService.getWarehouseById).toHaveBeenCalledWith(
        'warehouse-id-1',
      );
    });
  });

  describe('updateWarehouse', () => {
    it('should update a warehouse by ID', async () => {
      const updateWarehouseDto: UpdateWarehouseDTO = {
        name: 'Updated Warehouse',
      };

      const result = await warehouseController.updateWarehouse(
        'warehouse-id-1',
        updateWarehouseDto,
      );
      expect(result).toEqual(mockWarehouse);
      expect(warehouseService.updateWarehouse).toHaveBeenCalledWith(
        'warehouse-id-1',
        updateWarehouseDto,
      );
    });
  });

  describe('deleteWarehouse', () => {
    it('should delete a warehouse by ID', async () => {
      const result =
        await warehouseController.deleteWarehouse('warehouse-id-1');
      expect(result).toEqual({ message: 'Warehouse deleted successfully' });
      expect(warehouseService.deleteWarehouse).toHaveBeenCalledWith(
        'warehouse-id-1',
      );
    });
  });

  describe('getAllWarehouses', () => {
    it('should return a list of warehouses', async () => {
      const query: FindWarehousesParamsDTO = {
        page: 1,
        pageSize: 10,
        orderBy: WarehouseOrderColumn.CREATED_AT,
        orderDirection: 'asc',
      };

      const result = await warehouseController.getAllWarehouses(query);
      expect(result).toEqual({
        data: mockWarehouseList,
        total: mockWarehouseList.length,
      });
      expect(warehouseService.getAllWarehouses).toHaveBeenCalledWith(query);
    });
  });

  describe('connectUserToWarehouse', () => {
    it('should connect a user to a warehouse', async () => {
      const connectUserToWarehouseDto: ConnectUserToWarehouseDTO = {
        userId: 'user-id-1',
        warehouseId: 'warehouse-id-1',
      };

      const result = await warehouseController.connectUserToWarehouse(
        connectUserToWarehouseDto,
      );
      expect(result).toEqual({
        userId: 'user-id-1',
        warehouseId: 'warehouse-id-1',
      });
      expect(warehouseService.connectUserToWarehouse).toHaveBeenCalledWith(
        connectUserToWarehouseDto,
      );
    });
  });

  describe('getUserWarehouses', () => {
    it('should return warehouses connected to the user', async () => {
      const result = await warehouseController.getUserWarehouses();
      expect(result).toEqual(mockWarehouseList);
      expect(clsService.get).toHaveBeenCalledWith('user.id');
      expect(warehouseService.getWarehousesForUser).toHaveBeenCalledWith(
        'user-id-1',
      );
    });
  });
});
