import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateDeliveryDTO } from './dto/create-delivery.dto';
import { FindDeliveriesParamsDTO } from './dto/find-deliveries.dto';
import { UpdateDeliveryDTO } from './dto/update-delivery.dto';

@Injectable()
export class DeliveryService {
  private readonly logger = new Logger(DeliveryService.name);
  private readonly deliveryRepo: Prisma.DeliveryDelegate;

  constructor(private readonly prisma: PrismaService) {
    this.deliveryRepo = prisma.delivery;
  }

  async createDelivery(createDeliveryDto: CreateDeliveryDTO) {
    const { batches, ...deliveryData } = createDeliveryDto;

    const delivery = await this.deliveryRepo.create({
      data: {
        ...deliveryData,
        batches: {
          create: batches.map((batch) => ({
            batch: { create: batch },
          })),
        },
      },
    });

    this.logger.log(`Delivery created with id: ${delivery.id}`);
    return delivery;
  }

  async getDeliveryById(id: string) {
    const delivery = await this.deliveryRepo.findUnique({
      where: { id },
      include: { batches: { include: { batch: true } } },
    });

    if (!delivery)
      throw new NotFoundException(`Delivery with ID ${id} not found`);

    return delivery;
  }

  async updateDelivery(id: string, updateDeliveryDto: UpdateDeliveryDTO) {
    const delivery = await this.deliveryRepo.update({
      where: { id },
      data: updateDeliveryDto,
    });

    this.logger.log(`Delivery updated with id: ${delivery.id}`);
    return delivery;
  }

  async deleteDelivery(id: string) {
    await this.getDeliveryById(id);
    await this.deliveryRepo.delete({ where: { id } });
    this.logger.log(`Delivery deleted with id: ${id}`);
    return { message: `Delivery with id ${id} deleted successfully` };
  }

  async getAllDeliveries(params: FindDeliveriesParamsDTO) {
    const { page, pageSize, orderBy, orderDirection, ...filters } = params;

    const deliveries = await this.deliveryRepo.findMany({
      where: filters,
      orderBy: {
        [orderBy]: orderDirection,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const total = await this.deliveryRepo.count({ where: filters });
    return {
      data: deliveries,
      total,
    };
  }
}
