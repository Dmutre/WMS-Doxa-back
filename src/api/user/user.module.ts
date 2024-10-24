import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UserConstroller } from './user.controller';
import { UserMapper } from './user.mapper';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule],
  providers: [UserService, UserMapper],
  controllers: [UserConstroller],
  exports: [UserService],
})
export class UserModule {}
