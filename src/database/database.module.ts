import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RoleRepository } from './repository/role.repository';
import { UserRepository } from './repository/user.repository';

@Global()
@Module({
  providers: [PrismaService, UserRepository, RoleRepository],
  exports: [UserRepository, RoleRepository],
})
export class DatabaseModule {}
