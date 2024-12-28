import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Item } from '@prisma/client';
import { UserAction } from '../../lib/core/decorators/user-action.decorator';
import { AuthPermissions } from '../../lib/core/security/decorators/auth-permission';
import { Permissions } from '../../lib/types/auth/permission';
import { Action } from '../../lib/types/journal/user-action';
import { CreateItemDTO } from './dto/create-item.dto';
import { FindItemsParamsDTO } from './dto/find-item.dto';
import { ItemListDto, ItemDto } from './dto/item.dto';
import { UpdateItemDTO } from './dto/update-item.dto';
import { ItemService } from './item.service';

@ApiTags('Item')
@Controller('item')
@ApiBearerAuth()
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @UserAction(Action.CREATE_ITEM)
  @AuthPermissions([Permissions.CREATE_ITEM])
  @Post()
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({
    status: 201,
    type: ItemDto,
  })
  async createItem(@Body() createItemDto: CreateItemDTO): Promise<Item> {
    return await this.itemService.createItem(createItemDto);
  }

  @UserAction(Action.FIND_ITEM)
  @AuthPermissions([Permissions.FIND_ITEM])
  @Get('/:id')
  @ApiOperation({ summary: 'Get item by ID' })
  @ApiOkResponse({
    type: ItemDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Item not found',
  })
  async getItemById(@Param('id') id: string): Promise<Item> {
    return await this.itemService.getItemById(id);
  }

  @UserAction(Action.UPDATE_ITEM)
  @AuthPermissions([Permissions.UPDATE_ITEM])
  @Put('/:id')
  @ApiOperation({ summary: 'Update item by ID' })
  @ApiOkResponse({
    type: ItemDto,
  })
  async updateItem(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDTO,
  ): Promise<Item> {
    return await this.itemService.updateItem(id, updateItemDto);
  }

  @UserAction(Action.DELETE_ITEM)
  @AuthPermissions([Permissions.DELETE_ITEM])
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete item by ID' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  async deleteItem(@Param('id') id: string): Promise<{ message: string }> {
    return await this.itemService.deleteItem(id);
  }

  @UserAction(Action.FIND_ITEMS)
  @AuthPermissions([Permissions.FIND_ITEM])
  @Get()
  @ApiOperation({ summary: 'Get all items' })
  @ApiOkResponse({
    type: ItemListDto,
  })
  async getAllItems(
    @Query() query: FindItemsParamsDTO,
  ): Promise<{ data: Item[]; total: number }> {
    return await this.itemService.getAllItems(query);
  }
}
