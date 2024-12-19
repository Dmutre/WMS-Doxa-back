import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateBatchDTO } from './dto/create-batch.dto';
import { FindBatchesParamsDTO } from './dto/find-batch.dto';
import { UpdateBatchDTO } from './dto/update-batch.dto';

@Injectable()
export class BatchService {
  private readonly logger = new Logger(BatchService.name);
  private readonly batchRepo: Prisma.BatchDelegate;

  constructor(private readonly prisma: PrismaService) {
    this.batchRepo = prisma.batch;
  }

  async createBatch(createBatchDto: CreateBatchDTO) {
    const batch = await this.batchRepo.create({
      data: createBatchDto,
    });
    this.logger.log(`Batch created with id: ${batch.id}`);
    return batch;
  }

  async getBatchById(id: string) {
    const batch = await this.batchRepo.findUnique({ where: { id } });
    if (!batch) throw new NotFoundException(`Batch with ID ${id} not found`);
    return batch;
  }

  async updateBatch(id: string, updateBatchDto: UpdateBatchDTO) {
    const batch = await this.batchRepo.update({
      where: { id },
      data: updateBatchDto,
    });
    this.logger.log(`Batch updated with id: ${batch.id}`);
    return batch;
  }

  async deleteBatch(id: string) {
    await this.getBatchById(id);
    await this.batchRepo.delete({ where: { id } });
    this.logger.log(`Batch deleted with id: ${id}`);
    return { message: `Batch with id ${id} deleted successfully` };
  }

  async getAllBatches(params: FindBatchesParamsDTO) {
    const {
      warehouseId,
      itemId,
      isReserved,
      row,
      shelf,
      position,
      page,
      pageSize,
      orderBy,
      orderDirection,
    } = params;

    const where = {
      warehouseId,
      itemId,
      isReserved,
      row,
      shelf,
      position,
    };

    const batches = await this.batchRepo.findMany({
      where,
      orderBy: {
        [orderBy]: orderDirection,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const total = await this.batchRepo.count({ where });
    return {
      data: batches,
      total,
    };
  }
}
