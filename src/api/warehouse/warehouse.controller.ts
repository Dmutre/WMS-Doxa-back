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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User, Warehouse } from '@prisma/client';
import { CurrentUser } from 'src/lib/decorators/current-user.decorator';
import { UserAction } from 'src/lib/decorators/user-action.decorator';
import { AuthPermissions } from 'src/lib/security/decorators/auth-permission';
import { Action } from 'src/lib/types/journal/user-action';
import { ConnectUserToWarehouseDTO } from './dto/connect-user.to-warehouse.dto';
import { CreateWarehouseDTO } from './dto/create-warehouse.dto';
import { FindWarehousesParamsDTO } from './dto/find-warehouses.dto';
import { UpdateWarehouseDTO } from './dto/update-warehouse.dto';
import { WarehouseService } from './warehouse.service';

// TODO: Add authorization and permission guards
//       Describe response interfaces
@ApiTags('Warehouse')
@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @UserAction(Action.CREATE_WEREHOUSE)
  @AuthPermissions([])
  @Post()
  @ApiOperation({ summary: 'Create a new warehouse' })
  async createWarehouse(
    @Body() createWarehouseDto: CreateWarehouseDTO,
  ): Promise<Warehouse> {
    return await this.warehouseService.createWarehouse(createWarehouseDto);
  }

  @UserAction(Action.FIND_WEREHOUSE)
  @AuthPermissions([])
  @Get('/:id')
  @ApiOperation({ summary: 'Get warehouse by ID' })
  async getWarehouseById(@Param('id') id: string): Promise<Warehouse> {
    return await this.warehouseService.getWarehouseById(id);
  }

  @UserAction(Action.UPDATE_WEREHOUSE)
  @AuthPermissions([])
  @Put('/:id')
  @ApiOperation({ summary: 'Update warehouse by ID' })
  async updateWarehouse(
    @Param('id') id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDTO,
  ): Promise<Warehouse> {
    return await this.warehouseService.updateWarehouse(id, updateWarehouseDto);
  }

  @UserAction(Action.DELETE_WEREHOUSE)
  @AuthPermissions([])
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete warehouse by ID' })
  async deleteWarehouse(@Param('id') id: string): Promise<{ message: string }> {
    return await this.warehouseService.deleteWarehouse(id);
  }

  @UserAction(Action.FIND_WEREHOUSES)
  @AuthPermissions([])
  @Get()
  @ApiOperation({ summary: 'Get all warehouses' })
  async getAllWarehouses(
    @Query() query: FindWarehousesParamsDTO,
  ): Promise<{ data: Warehouse[]; total: number }> {
    return await this.warehouseService.getAllWarehouses(query);
  }

  @UserAction(Action.CONNECT_USER_TO_WEREHOUSE)
  @AuthPermissions([])
  @Post('/user/connect')
  @ApiOperation({ summary: 'Connect user to warehouse' })
  async connectUserToWarehouse(@Body() data: ConnectUserToWarehouseDTO) {
    return await this.warehouseService.connectUserToWarehouse(data);
  }

  @UserAction(Action.GET_USER_WEREHOUSES)
  @AuthPermissions([])
  @ApiOperation({
    summary: 'Get user warehouses (warehouses to which user is connected)',
  })
  async getUserWarehouses(@CurrentUser() user: User): Promise<Warehouse[]> {
    return await this.warehouseService.getWarehousesForUser(user.id);
  }
}
