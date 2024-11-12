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
import { AuthPermissions } from 'src/lib/security/decorators/auth-permission';
import { ConnectUserToWarehouseDTO } from './dto/connect-user.to-warehouse.dto';
import { CreateWarehouseDTO } from './dto/create-warehouse.dto';
import { FindWarehousesParamsDTO } from './dto/find-warehouses.dto';
import { UpdateWarehouseDTO } from './dto/update-warehouse.dto';
import { WarehouseService } from './warehouse.service';

// TO DO: add permissions and auth guard
@ApiTags('Warehouse')
@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new warehouse' })
  async createWarehouse(
    @Body() createWarehouseDto: CreateWarehouseDTO,
  ): Promise<Warehouse> {
    return await this.warehouseService.createWarehouse(createWarehouseDto);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get warehouse by ID' })
  async getWarehouseById(@Param('id') id: string): Promise<Warehouse> {
    return await this.warehouseService.getWarehouseById(id);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update warehouse by ID' })
  async updateWarehouse(
    @Param('id') id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDTO,
  ): Promise<Warehouse> {
    return await this.warehouseService.updateWarehouse(id, updateWarehouseDto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete warehouse by ID' })
  async deleteWarehouse(@Param('id') id: string): Promise<{ message: string }> {
    return await this.warehouseService.deleteWarehouse(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all warehouses' })
  async getAllWarehouses(
    @Query() query: FindWarehousesParamsDTO,
  ): Promise<{ data: Warehouse[]; total: number }> {
    return await this.warehouseService.getAllWarehouses(query);
  }

  @AuthPermissions([])
  @Post('/user/connect')
  @ApiOperation({ summary: 'Connect user to warehouse' })
  async connectUserToWarehouse(@Body() data: ConnectUserToWarehouseDTO) {
    return await this.warehouseService.connectUserToWarehouse(data);
  }

  @AuthPermissions([])
  @ApiOperation({
    summary: 'Get user warehouses (warehouses to which user is connected)',
  })
  async getUserWarehouses(@CurrentUser() user: User): Promise<Warehouse[]> {
    return await this.warehouseService.getWarehousesForUser(user.id);
  }
}
