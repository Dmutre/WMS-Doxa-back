import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UserConstroller } from './user.controller';
import { UserMapper } from './user.mapper';
import { UserService } from './user.service';

@Module({
  imports: [],
  providers: [PrismaService, UserService, UserMapper],
  controllers: [UserConstroller],
  exports: [UserService],
})
export class UserModule {}
