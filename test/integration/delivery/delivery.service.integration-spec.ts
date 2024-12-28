import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryType, DeliveryStatus } from '@prisma/client';
import { DeliveryService } from 'src/api/deliveries/delivery.service';
import { FindDeliveriesParamsDTO } from 'src/api/deliveries/dto/find-deliveries.dto';
import { PrismaService } from 'src/database/prisma.service';
import { DeliveryOrderColumn } from 'src/lib/types/delivery';

const testBatches = [
  { warehouseId: 'warehouse-1', itemId: 'item-1', quantity: 10 },
  { warehouseId: 'warehouse-1', itemId: 'item-2', quantity: 20 },
];

describe('DeliveryService (Integration)', () => {
  let deliveryService: DeliveryService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryService, PrismaService],
    }).compile();

    deliveryService = module.get<DeliveryService>(DeliveryService);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.$connect();

    await prisma.batch.deleteMany();
    await prisma.delivery.deleteMany();
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

    await prisma.item.createMany({
      data: [
        { id: 'item-1', name: 'Item 1', sku: 'SKU1' },
        { id: 'item-2', name: 'Item 2', sku: 'SKU2' },
      ],
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('createDelivery', () => {
    it('should create a delivery with batches', async () => {
      const createDeliveryDto = {
        type: DeliveryType.INCOMING,
        status: DeliveryStatus.SCHEDULED,
        scheduledAt: new Date(),
        batches: testBatches,
      };

      const delivery = await deliveryService.createDelivery(createDeliveryDto);

      expect(delivery).toBeDefined();
      expect(delivery.type).toBe(DeliveryType.INCOMING);
      expect(delivery.status).toBe(DeliveryStatus.SCHEDULED);
    });
  });

  describe('getDeliveryById', () => {
    it('should return a delivery by ID', async () => {
      const createDeliveryDto = {
        type: DeliveryType.OUTGOING,
        status: DeliveryStatus.LOADING,
        scheduledAt: new Date(),
        batches: testBatches,
      };

      const createdDelivery =
        await deliveryService.createDelivery(createDeliveryDto);

      const delivery = await deliveryService.getDeliveryById(
        createdDelivery.id,
      );

      expect(delivery).toBeDefined();
      expect(delivery.id).toBe(createdDelivery.id);
      expect(delivery.batches).toHaveLength(testBatches.length);
    });

    it('should throw NotFoundException for a non-existent delivery', async () => {
      await expect(
        deliveryService.getDeliveryById('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateDelivery', () => {
    it('should update a delivery', async () => {
      const createDeliveryDto = {
        type: DeliveryType.INCOMING,
        status: DeliveryStatus.SCHEDULED,
        scheduledAt: new Date(),
        batches: testBatches,
      };

      const createdDelivery =
        await deliveryService.createDelivery(createDeliveryDto);

      const updateDeliveryDto = {
        status: DeliveryStatus.DELIVERED,
        description: 'Updated description',
      };

      const updatedDelivery = await deliveryService.updateDelivery(
        createdDelivery.id,
        updateDeliveryDto,
      );

      expect(updatedDelivery).toBeDefined();
      expect(updatedDelivery.status).toBe(DeliveryStatus.DELIVERED);
      expect(updatedDelivery.description).toBe('Updated description');
    });
  });

  describe('deleteDelivery', () => {
    it('should delete a delivery', async () => {
      const createDeliveryDto = {
        type: DeliveryType.OUTGOING,
        status: DeliveryStatus.SCHEDULED,
        scheduledAt: new Date(),
        batches: testBatches,
      };

      const createdDelivery =
        await deliveryService.createDelivery(createDeliveryDto);

      const result = await deliveryService.deleteDelivery(createdDelivery.id);

      expect(result.message).toBe(
        `Delivery with id ${createdDelivery.id} deleted successfully`,
      );

      await expect(
        deliveryService.getDeliveryById(createdDelivery.id),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllDeliveries', () => {
    it('should return a paginated list of deliveries', async () => {
      const params: FindDeliveriesParamsDTO = {
        page: 1,
        pageSize: 10,
        orderBy: DeliveryOrderColumn.CREATED_AT,
        orderDirection: 'asc',
      };

      const result = await deliveryService.getAllDeliveries(params);

      expect(result.data).toBeDefined();
      expect(result.total).toBeGreaterThanOrEqual(0);
    });
  });
});
