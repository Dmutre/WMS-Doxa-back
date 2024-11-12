import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { JournalConstroller } from './journal.controller';
import { JournalService } from './journal.service';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [JournalService],
  controllers: [JournalConstroller],
  exports: [],
})
export class JournalModule {}
