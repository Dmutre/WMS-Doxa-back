import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { UserModule } from '../user/user.module';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

@Module({
  controllers: [ItemController],
  providers: [ItemService],
  imports: [DatabaseModule, UserModule],
})
export class ItemModule {}
