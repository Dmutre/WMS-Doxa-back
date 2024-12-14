import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Item } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { ItemOrderColumn } from '../../lib/types/item';
import { CreateItemDTO } from './dto/create-item.dto';
import { FindItemsParamsDTO } from './dto/find-item.dto';
import { UpdateItemDTO } from './dto/update-item.dto';
import { ItemService } from './item.service';

describe('ItemService', () => {
  let itemService: ItemService;
  let prismaService: PrismaService;

  const mockItem: Item = {
    id: 'item-id-1',
    name: 'Test Item',
    sku: '12345',
    description: 'Test Description',
    barcode: 'barcode-12345',
    weight: 1.5,
    dimensions: '10x10x10',
    category: 'Category A',
    manufacturer: 'Test Manufacturer',
    expirationDate: new Date(),
    warrantyPeriod: 12,
    originCountry: 'Country A',
    photoUrl: ['https://example.com/photo1'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    item: {
      create: jest.fn(() => Promise.resolve(mockItem)),
      findUnique: jest.fn(() => Promise.resolve(mockItem)),
      update: jest.fn(() => Promise.resolve(mockItem)),
      delete: jest.fn(() => Promise.resolve(mockItem)),
      findMany: jest.fn(() => Promise.resolve([mockItem])),
      count: jest.fn(() => Promise.resolve(1)),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    itemService = module.get<ItemService>(ItemService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(itemService).toBeDefined();
  });

  describe('createItem', () => {
    it('should create an item', async () => {
      const createItemDto: CreateItemDTO = {
        name: 'New Item',
        sku: '67890',
        description: 'New Description',
        barcode: 'new-barcode',
        weight: 2.0,
        dimensions: '20x20x20',
        category: 'Category B',
        manufacturer: 'New Manufacturer',
        originCountry: 'Country B',
      };

      const result = await itemService.createItem(createItemDto);
      expect(result).toEqual(mockItem);
      expect(prismaService.item.create).toHaveBeenCalledWith({
        data: createItemDto,
      });
    });
  });

  describe('getItemById', () => {
    it('should return an item by ID', async () => {
      const result = await itemService.getItemById('item-id-1');
      expect(result).toEqual(mockItem);
      expect(prismaService.item.findUnique).toHaveBeenCalledWith({
        where: { id: 'item-id-1' },
      });
    });

    it('should throw NotFoundException if item not found', async () => {
      jest.spyOn(prismaService.item, 'findUnique').mockResolvedValueOnce(null);

      await expect(itemService.getItemById('item-id-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateItem', () => {
    it('should update an item', async () => {
      const updateItemDto: UpdateItemDTO = {
        name: 'Updated Item',
      };

      const result = await itemService.updateItem('item-id-1', updateItemDto);
      expect(result).toEqual(mockItem);
      expect(prismaService.item.update).toHaveBeenCalledWith({
        where: { id: 'item-id-1' },
        data: updateItemDto,
      });
    });
  });

  describe('deleteItem', () => {
    it('should delete an item by ID', async () => {
      const result = await itemService.deleteItem('item-id-1');
      expect(result).toEqual({
        message: 'Item with id item-id-1 deleted successfully',
      });
      expect(prismaService.item.delete).toHaveBeenCalledWith({
        where: { id: 'item-id-1' },
      });
    });

    it('should throw NotFoundException if item not found before deleting', async () => {
      jest
        .spyOn(itemService, 'getItemById')
        .mockRejectedValueOnce(
          new NotFoundException('Item with ID item-id-1 not found'),
        );

      await expect(itemService.deleteItem('item-id-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAllItems', () => {
    it('should return a list of items with total count', async () => {
      const params: FindItemsParamsDTO = {
        name: 'Test',
        sku: '123',
        category: 'Category A',
        manufacturer: 'Test Manufacturer',
        originCountry: 'Country A',
        page: 1,
        pageSize: 10,
        orderBy: ItemOrderColumn.CREATED_AT,
        orderDirection: 'asc',
      };

      const result = await itemService.getAllItems(params);
      expect(result).toEqual({
        data: [mockItem],
        total: 1,
      });
      expect(prismaService.item.findMany).toHaveBeenCalledWith({
        where: {
          name: { contains: params.name },
          sku: { contains: params.sku },
          category: { contains: params.category },
          manufacturer: { contains: params.manufacturer },
          originCountry: { contains: params.originCountry },
        },
        orderBy: {
          [params.orderBy]: params.orderDirection,
        },
        skip: 0,
        take: 10,
      });
      expect(prismaService.item.count).toHaveBeenCalledWith({
        where: {
          name: { contains: params.name },
          sku: { contains: params.sku },
          category: { contains: params.category },
          manufacturer: { contains: params.manufacturer },
          originCountry: { contains: params.originCountry },
        },
      });
    });
  });
});
