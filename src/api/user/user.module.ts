import { Module } from '@nestjs/common';
import { UserConstroller } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from '../../database/repository/user.repository';

@Module({
  imports: [],
  providers: [UserRepository, UserService],
  controllers: [UserConstroller],
})
export class UserModule {}
