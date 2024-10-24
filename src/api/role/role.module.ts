import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { RoleConstroller } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [DatabaseModule],
  providers: [RoleService],
  controllers: [RoleConstroller],
  exports: [RoleService],
})
export class RoleModule {}
