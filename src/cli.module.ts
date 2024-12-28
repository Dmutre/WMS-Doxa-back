import { Module } from '@nestjs/common';
import { RoleService } from './api/role/role.service';
import { UserMapper } from './api/user/user.mapper';
import { UserService } from './api/user/user.service';
import { SudoCommand } from './commands/sudo.command';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [UserService, UserMapper, RoleService, SudoCommand],
})
export class CliModule {}
