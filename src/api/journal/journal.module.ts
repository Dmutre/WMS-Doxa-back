import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { JournalConstroller } from './journal.controller';
import { JournalService } from './journal.service';

@Module({
  imports: [DatabaseModule],
  providers: [JournalService],
  controllers: [JournalConstroller],
  exports: [JournalService],
})
export class JournalModule {}
