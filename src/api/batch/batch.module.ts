import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from '../user/user.module';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';

@Module({
  controllers: [BatchController],
  providers: [BatchService],
  imports: [DatabaseModule, UserModule],
})
export class BatchModule {}
