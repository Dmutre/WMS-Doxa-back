import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { UserService } from '../user/user.service';
import { ConnectUserToWarehouseDTO } from './dto/connect-user.to-warehouse.dto';
import { CreateWarehouseDTO } from './dto/create-warehouse.dto';
import { FindWarehousesParamsDTO } from './dto/find-warehouses.dto';
import { UpdateWarehouseDTO } from './dto/update-warehouse.dto';

@Injectable()
export class WarehouseService {
  private readonly logger = new Logger(WarehouseService.name);
  private readonly warehouseRepo: Prisma.WarehouseDelegate;
  private readonly userWarehouseRepo: Prisma.UserWarehouseDelegate;

  constructor(
    prisma: PrismaService,
    private readonly userService: UserService,
  ) {
    this.warehouseRepo = prisma.warehouse;
    this.userWarehouseRepo = prisma.userWarehouse;
  }

  async createWarehouse(createWarehouseDto: CreateWarehouseDTO) {
    const warehouse = await this.warehouseRepo.create({
      data: createWarehouseDto,
    });
    this.logger.log(`Warehouse created with id: ${warehouse.id}`);
    return warehouse;
  }

  async getWarehouseById(id: string) {
    const warehouse = await this.warehouseRepo.findUnique({ where: { id } });
    if (!warehouse)
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    return warehouse;
  }

  async updateWarehouse(id: string, updateWarehouseDto: UpdateWarehouseDTO) {
    const warehouse = await this.warehouseRepo.update({
      where: { id },
      data: updateWarehouseDto,
    });
    this.logger.log(`Warehouse updated with id: ${warehouse.id}`);
    return warehouse;
  }

  async deleteWarehouse(id: string) {
    await this.getWarehouseById(id);
    await this.warehouseRepo.delete({ where: { id } });
    this.logger.log(`Warehouse deleted with id: ${id}`);
    return { message: `Warehouse with id ${id} deleted successfully` };
  }

  async getAllWarehouses(params: FindWarehousesParamsDTO) {
    const { name, type, isActive, page, pageSize, orderBy, orderDirection } =
      params;

    const where = {
      name: { contains: name },
      type: { contains: type },
      isActive,
    };

    const warehouses = await this.warehouseRepo.findMany({
      where,
      orderBy: {
        [orderBy]: orderDirection,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const total = await this.warehouseRepo.count({ where });
    return {
      data: warehouses,
      total,
    };
  }

  async connectUserToWarehouse({
    userId,
    warehouseId,
  }: ConnectUserToWarehouseDTO) {
    const user = await this.userService.findUser(userId);
    const warehouse = await this.getWarehouseById(warehouseId);
    const userWarehouse = await this.userWarehouseRepo.create({
      data: {
        userId: user.id,
        warehouseId: warehouse.id,
      },
    });
    this.logger.log(
      `User ${userId} connected to Warehouse ${warehouseId} in user_warehouses`,
    );
    return userWarehouse;
  }

  async getWarehousesForUser(userId: string) {
    await this.userService.findUser(userId);

    const warehouses = await this.userWarehouseRepo.findMany({
      where: { userId },
      include: {
        warehouse: true,
      },
    });

    this.logger.log(`Fetched warehouses for user ${userId}`);
    return warehouses.map((userWarehouse) => userWarehouse.warehouse);
  }
}
