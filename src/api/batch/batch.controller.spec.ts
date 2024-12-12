import { Test, TestingModule } from '@nestjs/testing';
import { Batch } from '@prisma/client';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import { CreateBatchDTO } from './dto/create-batch.dto';
import { FindBatchesParamsDTO } from './dto/find-batch.dto';
import { UpdateBatchDTO } from './dto/update-batch.dto';

describe('BatchController', () => {
  let batchController: BatchController;
  let batchService: BatchService;

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

  const mockBatchList: Batch[] = [
    mockBatch,
    { ...mockBatch, id: 'batch-id-2' },
  ];

  const mockBatchService = {
    createBatch: jest.fn((dto: CreateBatchDTO) => Promise.resolve(mockBatch)),
    getBatchById: jest.fn((id: string) => Promise.resolve(mockBatch)),
    updateBatch: jest.fn((id: string, dto: UpdateBatchDTO) =>
      Promise.resolve({ ...mockBatch, ...dto }),
    ),
    deleteBatch: jest.fn((id: string) =>
      Promise.resolve({ message: `Batch ${id} deleted successfully` }),
    ),
    getAllBatches: jest.fn((query: FindBatchesParamsDTO) =>
      Promise.resolve({ data: mockBatchList, total: mockBatchList.length }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BatchController],
      providers: [
        {
          provide: BatchService,
          useValue: mockBatchService,
        },
      ],
    }).compile();

    batchController = module.get<BatchController>(BatchController);
    batchService = module.get<BatchService>(BatchService);
  });

  it('should be defined', () => {
    expect(batchController).toBeDefined();
  });

  describe('createBatch', () => {
    it('should create a new batch', async () => {
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
      const result = await batchController.createBatch(createBatchDto);
      expect(result).toEqual(mockBatch);
      expect(batchService.createBatch).toHaveBeenCalledWith(createBatchDto);
    });
  });

  describe('getBatchById', () => {
    it('should return a batch by ID', async () => {
      const result = await batchController.getBatchById('batch-id-1');
      expect(result).toEqual(mockBatch);
      expect(batchService.getBatchById).toHaveBeenCalledWith('batch-id-1');
    });
  });

  describe('updateBatch', () => {
    it('should update a batch by ID', async () => {
      const updateBatchDto: UpdateBatchDTO = {
        quantity: 150,
        row: 2,
      };
      const result = await batchController.updateBatch(
        'batch-id-1',
        updateBatchDto,
      );
      expect(result).toEqual({ ...mockBatch, ...updateBatchDto });
      expect(batchService.updateBatch).toHaveBeenCalledWith(
        'batch-id-1',
        updateBatchDto,
      );
    });
  });

  describe('deleteBatch', () => {
    it('should delete a batch by ID', async () => {
      const result = await batchController.deleteBatch('batch-id-1');
      expect(result).toEqual({
        message: 'Batch batch-id-1 deleted successfully',
      });
      expect(batchService.deleteBatch).toHaveBeenCalledWith('batch-id-1');
    });
  });

  describe('getAllBatches', () => {
    it('should return a list of batches', async () => {
      const query: FindBatchesParamsDTO = { warehouseId: 'warehouse-id-1' };
      const result = await batchController.getAllBatches(query);
      expect(result).toEqual({
        data: mockBatchList,
        total: mockBatchList.length,
      });
      expect(batchService.getAllBatches).toHaveBeenCalledWith(query);
    });
  });
});
