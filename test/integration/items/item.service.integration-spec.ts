import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { ItemService } from 'src/api/items/item.service';
import { PrismaService } from 'src/database/prisma.service';
import { FindItemsParams, ItemOrderColumn } from 'src/lib/types/item';

const testItems: Prisma.ItemCreateManyInput[] = [
  {
    name: 'Item 1',
    sku: 'SKU1',
    category: 'Category1',
    manufacturer: 'Manufacturer1',
  },
  {
    name: 'Item 2',
    sku: 'SKU2',
    category: 'Category2',
    manufacturer: 'Manufacturer2',
  },
];

describe('ItemService (Integration)', () => {
  let itemService: ItemService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemService, PrismaService],
    }).compile();

    itemService = module.get<ItemService>(ItemService);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.$connect();

    await prisma.batch.deleteMany();
    await prisma.item.deleteMany();
    await prisma.item.createMany({ data: testItems });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('createItem', () => {
    it('should create a new item', async () => {
      const createItemDto = {
        name: 'New Item',
        sku: 'NEW123',
        category: 'New Category',
        manufacturer: 'New Manufacturer',
      };

      const item = await itemService.createItem(createItemDto);

      expect(item).toBeDefined();
      expect(item.name).toBe('New Item');
      expect(item.sku).toBe('NEW123');
    });
  });

  describe('getItemById', () => {
    it('should return an item by ID', async () => {
      const existingItem = await prisma.item.findFirst();

      const item = await itemService.getItemById(existingItem.id);

      expect(item).toBeDefined();
      expect(item.id).toBe(existingItem.id);
    });

    it('should throw NotFoundException for a non-existent item', async () => {
      await expect(itemService.getItemById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateItem', () => {
    it('should update an existing item', async () => {
      const existingItem = await prisma.item.findFirst();

      const updateItemDto = {
        name: 'Updated Name',
        category: 'Updated Category',
      };

      const updatedItem = await itemService.updateItem(
        existingItem.id,
        updateItemDto,
      );

      expect(updatedItem).toBeDefined();
      expect(updatedItem.name).toBe('Updated Name');
      expect(updatedItem.category).toBe('Updated Category');
    });
  });

  describe('deleteItem', () => {
    it('should delete an existing item', async () => {
      const existingItem = await prisma.item.findFirst();

      const result = await itemService.deleteItem(existingItem.id);

      expect(result.message).toBe(
        `Item with id ${existingItem.id} deleted successfully`,
      );

      await expect(itemService.getItemById(existingItem.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAllItems', () => {
    it('should return a paginated list of items', async () => {
      const params: FindItemsParams = {
        page: 1,
        pageSize: 10,
        orderBy: ItemOrderColumn.CREATED_AT,
        orderDirection: 'asc',
      };

      const result = await itemService.getAllItems(params);

      expect(result.data).toBeDefined();
      expect(result.total).toBeGreaterThanOrEqual(1);
    });
  });
});
