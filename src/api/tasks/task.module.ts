import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [],
  providers: [TaskService],
  controllers: [TaskController],
  exports: [],
})
export class TaskModule {}
