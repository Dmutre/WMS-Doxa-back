import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from '../user/user.module';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';

@Module({
  providers: [WarehouseService],
  controllers: [WarehouseController],
  imports: [DatabaseModule, UserModule],
})
export class WarehouseModule {}
