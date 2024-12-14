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
import { Delivery } from '@prisma/client';
import { UserAction } from 'src/lib/decorators/user-action.decorator';
import { AuthPermissions } from 'src/lib/security/decorators/auth-permission';
import { Permissions } from 'src/lib/types/auth/permission';
import { Action } from 'src/lib/types/journal/user-action';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDTO } from './dto/create-delivery.dto';
import { DeliveryDto, DeliveryListDto } from './dto/delivery.dto';
import { FindDeliveriesParamsDTO } from './dto/find-deliveries.dto';
import { UpdateDeliveryDTO } from './dto/update-delivery.dto';

@ApiTags('Delivery')
@Controller('delivery')
@ApiBearerAuth()
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @UserAction(Action.CREATE_DELIVERY)
  @AuthPermissions([Permissions.CREATE_DELIVERY])
  @Post()
  @ApiOperation({ summary: 'Create a new delivery' })
  @ApiResponse({
    status: 201,
    type: DeliveryDto,
  })
  async createDelivery(
    @Body() createDeliveryDto: CreateDeliveryDTO,
  ): Promise<Delivery> {
    return await this.deliveryService.createDelivery(createDeliveryDto);
  }

  @UserAction(Action.FIND_DELIVERY)
  @AuthPermissions([Permissions.FIND_DELIVERY])
  @Get('/:id')
  @ApiOperation({ summary: 'Get delivery by ID' })
  @ApiOkResponse({
    type: DeliveryDto,
  })
  async getDeliveryById(@Param('id') id: string): Promise<Delivery> {
    return await this.deliveryService.getDeliveryById(id);
  }

  @UserAction(Action.UPDATE_DELIVERY)
  @AuthPermissions([Permissions.UPDATE_DELIVERY])
  @Put('/:id')
  @ApiOperation({ summary: 'Update delivery by ID' })
  @ApiOkResponse({
    type: DeliveryDto,
  })
  async updateDelivery(
    @Param('id') id: string,
    @Body() updateDeliveryDto: UpdateDeliveryDTO,
  ): Promise<Delivery> {
    return await this.deliveryService.updateDelivery(id, updateDeliveryDto);
  }

  @UserAction(Action.DELETE_DELIVERY)
  @AuthPermissions([Permissions.DELETE_DELIVERY])
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete delivery by ID' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  async deleteDelivery(@Param('id') id: string): Promise<{ message: string }> {
    return await this.deliveryService.deleteDelivery(id);
  }

  @UserAction(Action.FIND_DELIVERIES)
  @AuthPermissions([Permissions.FIND_DELIVERY])
  @Get()
  @ApiOperation({ summary: 'Get all deliveries' })
  @ApiOkResponse({
    type: DeliveryListDto,
  })
  async getAllDeliveries(
    @Query() query: FindDeliveriesParamsDTO,
  ): Promise<{ data: Delivery[]; total: number }> {
    return await this.deliveryService.getAllDeliveries(query);
  }
}
