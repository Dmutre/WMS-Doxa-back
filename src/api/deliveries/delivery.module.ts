import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';

@Module({
  controllers: [DeliveryController],
  providers: [DeliveryService],
  imports: [DatabaseModule],
})
export class DeliveryModule {}
