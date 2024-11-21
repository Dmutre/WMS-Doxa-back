import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Item, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateItemDTO } from './dto/create-item.dto';
import { FindItemsParamsDTO } from './dto/find-item.dto';
import { UpdateItemDTO } from './dto/update-item.dto';

@Injectable()
export class ItemService {
  private readonly logger = new Logger(ItemService.name);
  private readonly itemRepo: Prisma.ItemDelegate;

  constructor(private readonly prisma: PrismaService) {
    this.itemRepo = prisma.item;
  }

  async createItem(createItemDto: CreateItemDTO): Promise<Item> {
    const item = await this.itemRepo.create({
      data: createItemDto,
    });
    this.logger.log(`Item created with id: ${item.id}`);
    return item;
  }

  async getItemById(id: string): Promise<Item> {
    const item = await this.itemRepo.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Item with ID ${id} not found`);
    return item;
  }

  async updateItem(id: string, updateItemDto: UpdateItemDTO): Promise<Item> {
    const item = await this.itemRepo.update({
      where: { id },
      data: updateItemDto,
    });
    this.logger.log(`Item updated with id: ${item.id}`);
    return item;
  }

  async deleteItem(id: string): Promise<{ message: string }> {
    await this.getItemById(id);
    await this.itemRepo.delete({ where: { id } });
    this.logger.log(`Item deleted with id: ${id}`);
    return { message: `Item with id ${id} deleted successfully` };
  }

  async getAllItems(
    params: FindItemsParamsDTO,
  ): Promise<{ data: Item[]; total: number }> {
    const {
      name,
      sku,
      category,
      manufacturer,
      originCountry,
      page,
      pageSize,
      orderBy,
      orderDirection,
    } = params;

    const where = {
      name: { contains: name },
      sku: { contains: sku },
      category: { contains: category },
      manufacturer: { contains: manufacturer },
      originCountry: { contains: originCountry },
    };

    const items = await this.itemRepo.findMany({
      where,
      orderBy: {
        [orderBy]: orderDirection,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const total = await this.itemRepo.count({ where });
    return {
      data: items,
      total,
    };
  }
}
