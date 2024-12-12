import { Test, TestingModule } from '@nestjs/testing';
import { Item } from '@prisma/client';
import { ClsService } from 'nestjs-cls';
import { ItemOrderColumn } from '../../lib/types/item';
import { AuthService } from '../auth/auth.service';
import { CreateItemDTO } from './dto/create-item.dto';
import { FindItemsParamsDTO } from './dto/find-item.dto';
import { UpdateItemDTO } from './dto/update-item.dto';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

describe('ItemController', () => {
  let itemController: ItemController;
  let itemService: ItemService;

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

  const mockItemList: Item[] = [mockItem, { ...mockItem, id: 'item-id-2' }];

  const mockItemService = {
    createItem: jest.fn(() => Promise.resolve(mockItem)),
    getItemById: jest.fn(() => Promise.resolve(mockItem)),
    updateItem: jest.fn((_id: string, dto: UpdateItemDTO) =>
      Promise.resolve({ ...mockItem, ...dto }),
    ),
    deleteItem: jest.fn((id: string) =>
      Promise.resolve({ message: `Item ${id} deleted successfully` }),
    ),
    getAllItems: jest.fn(() =>
      Promise.resolve({ data: mockItemList, total: mockItemList.length }),
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
      controllers: [ItemController],
      providers: [
        {
          provide: ItemService,
          useValue: mockItemService,
        },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ClsService, useValue: mockClsService },
      ],
    }).compile();

    itemController = module.get<ItemController>(ItemController);
    itemService = module.get<ItemService>(ItemService);
  });

  it('should be defined', () => {
    expect(itemController).toBeDefined();
  });

  describe('createItem', () => {
    it('should create a new item', async () => {
      const createItemDto: CreateItemDTO = {
        name: 'New Item',
        sku: '12345',
        description: 'New Description',
        barcode: 'new-barcode',
        weight: 1.0,
        dimensions: '10x10x10',
        category: 'Category B',
        manufacturer: 'New Manufacturer',
        originCountry: 'Country B',
      };

      const result = await itemController.createItem(createItemDto);
      expect(result).toEqual(mockItem);
      expect(itemService.createItem).toHaveBeenCalledWith(createItemDto);
    });
  });

  describe('getItemById', () => {
    it('should return an item by ID', async () => {
      const result = await itemController.getItemById('item-id-1');
      expect(result).toEqual(mockItem);
      expect(itemService.getItemById).toHaveBeenCalledWith('item-id-1');
    });
  });

  describe('updateItem', () => {
    it('should update an item by ID', async () => {
      const updateItemDto: UpdateItemDTO = {
        name: 'Updated Item',
      };

      const result = await itemController.updateItem(
        'item-id-1',
        updateItemDto,
      );
      expect(result).toEqual({ ...mockItem, ...updateItemDto });
      expect(itemService.updateItem).toHaveBeenCalledWith(
        'item-id-1',
        updateItemDto,
      );
    });
  });

  describe('deleteItem', () => {
    it('should delete an item by ID', async () => {
      const result = await itemController.deleteItem('item-id-1');
      expect(result).toEqual({
        message: 'Item item-id-1 deleted successfully',
      });
      expect(itemService.deleteItem).toHaveBeenCalledWith('item-id-1');
    });
  });

  describe('getAllItems', () => {
    it('should return a list of items', async () => {
      const query: FindItemsParamsDTO = {
        page: 1,
        pageSize: 10,
        orderBy: ItemOrderColumn.CREATED_AT,
        orderDirection: 'asc',
      };

      const result = await itemController.getAllItems(query);
      expect(result).toEqual({
        data: mockItemList,
        total: mockItemList.length,
      });
      expect(itemService.getAllItems).toHaveBeenCalledWith(query);
    });
  });
});
