import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Batch } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { BatchOrderColumn } from '../../lib/types/batch';
import { BatchService } from './batch.service';
import { CreateBatchDTO } from './dto/create-batch.dto';
import { FindBatchesParamsDTO } from './dto/find-batch.dto';
import { UpdateBatchDTO } from './dto/update-batch.dto';

describe('BatchService', () => {
  let batchService: BatchService;
  let prismaService: PrismaService;

  const mockBatch: Batch = {
    id: 'batch-id-1',
    warehouseId: 'warehouse-id-1',
    itemId: 'item-id-1',
    quantity: 100,
    row: 1,
    shelf: 2,
    position: 3,
    width: 50.0,
    height: 30.0,
    depth: 20.0,
    weight: 10.0,
    receivedAt: new Date(),
    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    isReserved: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    batch: {
      create: jest.fn(() => Promise.resolve(mockBatch)),
      findUnique: jest.fn(() => Promise.resolve(mockBatch)),
      update: jest.fn(() => Promise.resolve(mockBatch)),
      delete: jest.fn(() => Promise.resolve(mockBatch)),
      findMany: jest.fn(() => Promise.resolve([mockBatch])),
      count: jest.fn(() => Promise.resolve(1)),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BatchService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    batchService = module.get<BatchService>(BatchService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(batchService).toBeDefined();
  });

  describe('createBatch', () => {
    it('should create a batch', async () => {
      const createBatchDto: CreateBatchDTO = {
        warehouseId: 'warehouse-id-1',
        itemId: 'item-id-1',
        quantity: 100,
        row: 1,
        shelf: 2,
        position: 3,
        width: 50.0,
        height: 30.0,
        depth: 20.0,
        weight: 10.0,
        expiryDate: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1),
        ),
      };

      const result = await batchService.createBatch(createBatchDto);
      expect(result).toEqual(mockBatch);
      expect(prismaService.batch.create).toHaveBeenCalledWith({
        data: createBatchDto,
      });
    });
  });

  describe('getBatchById', () => {
    it('should return a batch by ID', async () => {
      const result = await batchService.getBatchById('batch-id-1');
      expect(result).toEqual(mockBatch);
      expect(prismaService.batch.findUnique).toHaveBeenCalledWith({
        where: { id: 'batch-id-1' },
      });
    });

    it('should throw NotFoundException if batch not found', async () => {
      jest.spyOn(prismaService.batch, 'findUnique').mockResolvedValueOnce(null);

      await expect(batchService.getBatchById('batch-id-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateBatch', () => {
    it('should update a batch', async () => {
      const updateBatchDto: UpdateBatchDTO = {
        quantity: 150,
      };

      const result = await batchService.updateBatch(
        'batch-id-1',
        updateBatchDto,
      );
      expect(result).toEqual(mockBatch);
      expect(prismaService.batch.update).toHaveBeenCalledWith({
        where: { id: 'batch-id-1' },
        data: updateBatchDto,
      });
    });
  });

  describe('deleteBatch', () => {
    it('should delete a batch by ID', async () => {
      const result = await batchService.deleteBatch('batch-id-1');
      expect(result).toEqual({
        message: 'Batch with id batch-id-1 deleted successfully',
      });
      expect(prismaService.batch.delete).toHaveBeenCalledWith({
        where: { id: 'batch-id-1' },
      });
    });

    it('should throw NotFoundException if batch not found before deleting', async () => {
      jest
        .spyOn(batchService, 'getBatchById')
        .mockRejectedValueOnce(
          new NotFoundException('Batch with ID batch-id-1 not found'),
        );

      await expect(batchService.deleteBatch('batch-id-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAllBatches', () => {
    it('should return a list of batches with total count', async () => {
      const params: FindBatchesParamsDTO = {
        warehouseId: 'warehouse-id-1',
        page: 1,
        pageSize: 10,
        orderBy: BatchOrderColumn.CREATED_AT,
        orderDirection: 'asc',
      };

      const result = await batchService.getAllBatches(params);
      expect(result).toEqual({
        data: [mockBatch],
        total: 1,
      });
      expect(prismaService.batch.findMany).toHaveBeenCalledWith({
        where: {
          warehouseId: params.warehouseId,
        },
        orderBy: {
          [params.orderBy]: params.orderDirection,
        },
        skip: 0,
        take: 10,
      });
      expect(prismaService.batch.count).toHaveBeenCalledWith({
        where: {
          warehouseId: params.warehouseId,
        },
      });
    });
  });
});
