import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service';
import { UserService } from '../user/user.service';
import { ConnectUserToWarehouseDTO } from './dto/connect-user.to-warehouse.dto';
import { CreateWarehouseDTO } from './dto/create-warehouse.dto';
import { FindWarehousesParamsDTO } from './dto/find-warehouses.dto';
import { UpdateWarehouseDTO } from './dto/update-warehouse.dto';
import { WarehouseService } from './warehouse.service';
import { WarehouseOrderColumn } from '../../lib/types/warehouse';

describe('WarehouseService', () => {
  let warehouseService: WarehouseService;
  let prismaService: PrismaService;
  let userService: UserService;

  const mockWarehouse = {
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

  const mockUser = {
    id: 'user-id-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  };

  const mockWarehouseRepo = {
    create: jest.fn(() => Promise.resolve(mockWarehouse)),
    findUnique: jest.fn(() => Promise.resolve(mockWarehouse)),
    update: jest.fn(() => Promise.resolve(mockWarehouse)),
    delete: jest.fn(() => Promise.resolve(mockWarehouse)),
    findMany: jest.fn(() => Promise.resolve([mockWarehouse])),
    count: jest.fn(() => Promise.resolve(1)),
  };

  const mockUserWarehouseRepo = {
    create: jest.fn(() =>
      Promise.resolve({ userId: 'user-id-1', warehouseId: 'warehouse-id-1' }),
    ),
    findMany: jest.fn(() =>
      Promise.resolve([
        {
          userId: 'user-id-1',
          warehouseId: 'warehouse-id-1',
          warehouse: mockWarehouse,
        },
      ]),
    ),
  };

  const mockUserService = {
    findUser: jest.fn(() => Promise.resolve(mockUser)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WarehouseService,
        {
          provide: PrismaService,
          useValue: {
            warehouse: mockWarehouseRepo,
            userWarehouse: mockUserWarehouseRepo,
          },
        },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    warehouseService = module.get<WarehouseService>(WarehouseService);
    prismaService = module.get<PrismaService>(PrismaService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(warehouseService).toBeDefined();
  });

  describe('createWarehouse', () => {
    it('should create a new warehouse', async () => {
      const createWarehouseDto: CreateWarehouseDTO = {
        name: 'New Warehouse',
        type: 'Storage',
        address: '123 Test St',
        area: 2000,
      };

      const result = await warehouseService.createWarehouse(createWarehouseDto);
      expect(result).toEqual(mockWarehouse);
      expect(mockWarehouseRepo.create).toHaveBeenCalledWith({
        data: createWarehouseDto,
      });
    });
  });

  describe('getWarehouseById', () => {
    it('should return a warehouse by ID', async () => {
      const result = await warehouseService.getWarehouseById('warehouse-id-1');
      expect(result).toEqual(mockWarehouse);
      expect(mockWarehouseRepo.findUnique).toHaveBeenCalledWith({
        where: { id: 'warehouse-id-1' },
      });
    });

    it('should throw NotFoundException if warehouse is not found', async () => {
      jest.spyOn(mockWarehouseRepo, 'findUnique').mockResolvedValueOnce(null);
      await expect(
        warehouseService.getWarehouseById('warehouse-id-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateWarehouse', () => {
    it('should update a warehouse by ID', async () => {
      const updateWarehouseDto: UpdateWarehouseDTO = {
        name: 'Updated Warehouse',
        updatedAt: new Date(),
      };

      const result = await warehouseService.updateWarehouse(
        'warehouse-id-1',
        updateWarehouseDto,
      );
      expect(result).toEqual(mockWarehouse);
      expect(mockWarehouseRepo.update).toHaveBeenCalledWith({
        where: { id: 'warehouse-id-1' },
        data: updateWarehouseDto,
      });
    });
  });

  describe('deleteWarehouse', () => {
    it('should delete a warehouse by ID', async () => {
      const result = await warehouseService.deleteWarehouse('warehouse-id-1');
      expect(result).toEqual({
        message: 'Warehouse with id warehouse-id-1 deleted successfully',
      });
      expect(mockWarehouseRepo.delete).toHaveBeenCalledWith({
        where: { id: 'warehouse-id-1' },
      });
    });

    it('should throw NotFoundException if warehouse is not found', async () => {
      jest.spyOn(mockWarehouseRepo, 'findUnique').mockResolvedValueOnce(null);
      await expect(
        warehouseService.deleteWarehouse('warehouse-id-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('connectUserToWarehouse', () => {
    it('should connect a user to a warehouse', async () => {
      const connectUserToWarehouseDto: ConnectUserToWarehouseDTO = {
        userId: 'user-id-1',
        warehouseId: 'warehouse-id-1',
      };

      const result = await warehouseService.connectUserToWarehouse(
        connectUserToWarehouseDto,
      );
      expect(result).toEqual({
        userId: 'user-id-1',
        warehouseId: 'warehouse-id-1',
      });
      expect(mockUserService.findUser).toHaveBeenCalledWith('user-id-1');
      expect(mockWarehouseRepo.findUnique).toHaveBeenCalledWith({
        where: { id: 'warehouse-id-1' },
      });
      expect(mockUserWarehouseRepo.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-id-1',
          warehouseId: 'warehouse-id-1',
        },
      });
    });
  });

  describe('getWarehousesForUser', () => {
    it('should return warehouses connected to the user', async () => {
      const result = await warehouseService.getWarehousesForUser('user-id-1');
      expect(result).toEqual([mockWarehouse]);
      expect(mockUserService.findUser).toHaveBeenCalledWith('user-id-1');
      expect(mockUserWarehouseRepo.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-id-1' },
        include: { warehouse: true },
      });
    });
  });

  describe('getAllWarehouses', () => {
    it('should return a list of warehouses with total count', async () => {
      const query: FindWarehousesParamsDTO = {
        name: 'Test',
        type: 'Storage',
        isActive: true,
        page: 1,
        pageSize: 10,
        orderBy: WarehouseOrderColumn.CREATED_AT,
        orderDirection: 'asc',
      };

      const result = await warehouseService.getAllWarehouses(query);
      expect(result).toEqual({ data: [mockWarehouse], total: 1 });
      expect(mockWarehouseRepo.findMany).toHaveBeenCalledWith({
        where: {
          name: { contains: 'Test' },
          type: { contains: 'Storage' },
          isActive: true,
        },
        orderBy: { createdAt: 'asc' },
        skip: 0,
        take: 10,
      });
      expect(mockWarehouseRepo.count).toHaveBeenCalledWith({
        where: {
          name: { contains: 'Test' },
          type: { contains: 'Storage' },
          isActive: true,
        },
      });
    });
  });
});
