import { NotFoundException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { BatchService } from 'src/api/batch/batch.service';
import { FindBatchesParamsDTO } from 'src/api/batch/dto/find-batch.dto';
import { PrismaService } from 'src/database/prisma.service';
import { BatchOrderColumn } from 'src/lib/types/batch';

describe('BatchService (Integration)', () => {
  let batchService: BatchService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BatchService, PrismaService],
    }).compile();

    batchService = module.get<BatchService>(BatchService);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.$connect();

    await prisma.batch.deleteMany();
    await prisma.warehouse.deleteMany();
    await prisma.item.deleteMany();

    await prisma.warehouse.create({
      data: {
        id: 'warehouse-1',
        name: 'Test Warehouse',
        type: 'STORAGE',
        address: '123 Street',
      },
    });

    await prisma.item.create({
      data: { id: 'item-1', name: 'Test Item', sku: '123-ABC' },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('createBatch', () => {
    it('should create a batch', async () => {
      const createBatchDto = {
        warehouseId: 'warehouse-1',
        itemId: 'item-1',
        quantity: 100,
      };

      const batch = await batchService.createBatch(createBatchDto);

      expect(batch).toBeDefined();
      expect(batch.quantity).toBe(100);
      expect(batch.warehouseId).toBe('warehouse-1');
      expect(batch.itemId).toBe('item-1');
    });
  });

  describe('getBatchById', () => {
    it('should return a batch by ID', async () => {
      const createBatchDto = {
        warehouseId: 'warehouse-1',
        itemId: 'item-1',
        quantity: 50,
      };
      const createdBatch = await batchService.createBatch(createBatchDto);

      const batch = await batchService.getBatchById(createdBatch.id);

      expect(batch).toBeDefined();
      expect(batch.id).toBe(createdBatch.id);
    });

    it('should throw NotFoundException for a non-existent batch', async () => {
      await expect(
        batchService.getBatchById('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateBatch', () => {
    it('should update a batch', async () => {
      const createBatchDto = {
        warehouseId: 'warehouse-1',
        itemId: 'item-1',
        quantity: 75,
      };
      const createdBatch = await batchService.createBatch(createBatchDto);

      const updateBatchDto = {
        quantity: 150,
      };

      const updatedBatch = await batchService.updateBatch(
        createdBatch.id,
        updateBatchDto,
      );

      expect(updatedBatch).toBeDefined();
      expect(updatedBatch.quantity).toBe(150);
    });
  });

  describe('deleteBatch', () => {
    it('should delete a batch', async () => {
      const createBatchDto = {
        warehouseId: 'warehouse-1',
        itemId: 'item-1',
        quantity: 30,
      };
      const createdBatch = await batchService.createBatch(createBatchDto);

      const result = await batchService.deleteBatch(createdBatch.id);

      expect(result.message).toBe(
        `Batch with id ${createdBatch.id} deleted successfully`,
      );

      await expect(batchService.getBatchById(createdBatch.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAllBatches', () => {
    it('should return a paginated list of batches', async () => {
      const params: FindBatchesParamsDTO = {
        warehouseId: 'warehouse-1',
        page: 1,
        pageSize: 10,
        orderBy: BatchOrderColumn.CREATED_AT,
        orderDirection: 'asc',
      };

      const result = await batchService.getAllBatches(params);

      expect(result.data).toBeDefined();
      expect(result.total).toBeGreaterThanOrEqual(0);
    });
  });
});
