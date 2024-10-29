import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { RoleModule } from '../role/role.module';
import { RoleService } from '../role/role.service';
import { UserConstroller } from './user.controller';
import { UserMapper } from './user.mapper';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule, RoleModule],
  providers: [UserService, UserMapper, RoleService],
  controllers: [UserConstroller],
  exports: [UserService],
})
export class UserModule {}
