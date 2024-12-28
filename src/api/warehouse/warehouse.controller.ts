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
import { Warehouse } from '@prisma/client';
import { ClsService } from 'nestjs-cls';
import { UserAction } from '../../lib/core/decorators/user-action.decorator';
import { AuthPermissions } from '../../lib/core/security/decorators/auth-permission';
import { Permissions } from '../../lib/types/auth/permission';
import { AppContext } from '../../lib/types/common';
import { Action } from '../../lib/types/journal/user-action';
import { ConnectUserToWarehouseDTO } from './dto/connect-user.to-warehouse.dto';
import { CreateWarehouseDTO } from './dto/create-warehouse.dto';
import { FindWarehousesParamsDTO } from './dto/find-warehouses.dto';
import { UpdateWarehouseDTO } from './dto/update-warehouse.dto';
import { WerehouseListDto, WerehouseDto } from './dto/werehouse.dto';
import { WarehouseService } from './warehouse.service';

@ApiTags('Warehouse')
@Controller('warehouse')
@ApiBearerAuth()
export class WarehouseController {
  constructor(
    private readonly warehouseService: WarehouseService,
    private readonly cls: ClsService<AppContext>,
  ) {}

  @UserAction(Action.CREATE_WEREHOUSE)
  @AuthPermissions([Permissions.CREATE_WAREHOUSE])
  @Post()
  @ApiOperation({ summary: 'Create a new warehouse' })
  @ApiResponse({
    status: 201,
    type: WerehouseDto,
  })
  async createWarehouse(
    @Body() createWarehouseDto: CreateWarehouseDTO,
  ): Promise<Warehouse> {
    return await this.warehouseService.createWarehouse(createWarehouseDto);
  }

  @UserAction(Action.FIND_WEREHOUSE)
  @AuthPermissions([Permissions.FIND_WAREHOUSE])
  @Get('/:id')
  @ApiOperation({ summary: 'Get warehouse by ID' })
  @ApiOkResponse({
    type: WerehouseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Warehouse not found',
  })
  async getWarehouseById(@Param('id') id: string): Promise<Warehouse> {
    return await this.warehouseService.getWarehouseById(id);
  }

  @UserAction(Action.UPDATE_WEREHOUSE)
  @AuthPermissions([Permissions.UPDATE_WAREHOUSE])
  @Put('/:id')
  @ApiOperation({ summary: 'Update warehouse by ID' })
  @ApiOkResponse({
    type: WerehouseDto,
  })
  async updateWarehouse(
    @Param('id') id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDTO,
  ): Promise<Warehouse> {
    return await this.warehouseService.updateWarehouse(id, updateWarehouseDto);
  }

  @UserAction(Action.DELETE_WEREHOUSE)
  @AuthPermissions([Permissions.DELETE_WAREHOUSE])
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete warehouse by ID' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  async deleteWarehouse(@Param('id') id: string): Promise<{ message: string }> {
    return await this.warehouseService.deleteWarehouse(id);
  }

  @UserAction(Action.FIND_WEREHOUSES)
  @AuthPermissions([Permissions.FIND_WAREHOUSE])
  @Get()
  @ApiOperation({ summary: 'Get all warehouses' })
  @ApiOkResponse({
    type: WerehouseListDto,
  })
  async getAllWarehouses(
    @Query() query: FindWarehousesParamsDTO,
  ): Promise<{ data: Warehouse[]; total: number }> {
    return await this.warehouseService.getAllWarehouses(query);
  }

  @UserAction(Action.CONNECT_USER_TO_WEREHOUSE)
  @AuthPermissions([Permissions.CONNECT_USER_TO_WEREHOUSE])
  @Post('/user/connect')
  @ApiOperation({ summary: 'Connect user to warehouse' })
  @ApiResponse({
    status: 201,
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        warehouseId: { type: 'string' },
      },
    },
  })
  async connectUserToWarehouse(@Body() data: ConnectUserToWarehouseDTO) {
    return await this.warehouseService.connectUserToWarehouse(data);
  }

  @UserAction(Action.GET_USER_WEREHOUSES)
  @AuthPermissions([Permissions.FIND_WAREHOUSE])
  @Get('/user')
  @ApiOperation({
    summary: 'Get user warehouses (warehouses to which user is connected)',
  })
  @ApiOkResponse({
    type: WerehouseListDto,
  })
  async getUserWarehouses(): Promise<Warehouse[]> {
    const userId = this.cls.get('user.id');
    return await this.warehouseService.getWarehousesForUser(userId);
  }
}
