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
import { Batch } from '@prisma/client';
import { UserAction } from '../../lib/core/decorators/user-action.decorator';
import { AuthPermissions } from '../../lib/security/decorators/auth-permission';
import { Permissions } from '../../lib/types/auth/permission';
import { Action } from '../../lib/types/journal/user-action';
import { BatchService } from './batch.service';
import { BatchDto, BatchListDto } from './dto/batch.dto';
import { CreateBatchDTO } from './dto/create-batch.dto';
import { FindBatchesParamsDTO } from './dto/find-batch.dto';
import { UpdateBatchDTO } from './dto/update-batch.dto';

@ApiTags('Batch')
@Controller('batch')
@ApiBearerAuth()
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @UserAction(Action.CREATE_BATCH)
  @AuthPermissions([Permissions.CREATE_BATCH])
  @Post()
  @ApiOperation({ summary: 'Create a new batch' })
  @ApiResponse({
    status: 201,
    type: BatchDto,
  })
  async createBatch(@Body() createBatchDto: CreateBatchDTO): Promise<Batch> {
    return await this.batchService.createBatch(createBatchDto);
  }

  @UserAction(Action.FIND_BATCH)
  @AuthPermissions([Permissions.FIND_BATCH])
  @Get('/:id')
  @ApiOperation({ summary: 'Get batch by ID' })
  @ApiOkResponse({
    type: BatchDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Batch not found',
  })
  async getBatchById(@Param('id') id: string): Promise<Batch> {
    return await this.batchService.getBatchById(id);
  }

  @UserAction(Action.UPDATE_BATCH)
  @AuthPermissions([Permissions.UPDATE_BATCH])
  @Put('/:id')
  @ApiOperation({ summary: 'Update batch by ID' })
  @ApiOkResponse({
    type: BatchDto,
  })
  async updateBatch(
    @Param('id') id: string,
    @Body() updateBatchDto: UpdateBatchDTO,
  ): Promise<Batch> {
    return await this.batchService.updateBatch(id, updateBatchDto);
  }

  @UserAction(Action.DELETE_BATCH)
  @AuthPermissions([Permissions.DELETE_BATCH])
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete batch by ID' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  async deleteBatch(@Param('id') id: string): Promise<{ message: string }> {
    return await this.batchService.deleteBatch(id);
  }

  @UserAction(Action.FIND_BATCHES)
  @AuthPermissions([Permissions.FIND_BATCH])
  @Get()
  @ApiOperation({ summary: 'Get all batches' })
  @ApiOkResponse({
    type: BatchListDto,
  })
  async getAllBatches(
    @Query() query: FindBatchesParamsDTO,
  ): Promise<{ data: Batch[]; total: number }> {
    return await this.batchService.getAllBatches(query);
  }
}
