import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ClsModule } from 'nestjs-cls';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './api/auth/auth.module';
import { BatchModule } from './api/batch/batch.module';
import { ItemModule } from './api/items/item.module';
import { JournalModule } from './api/journal/journal.module';
import { RoleModule } from './api/role/role.module';
import { TaskModule } from './api/tasks/task.module';
import { UserModule } from './api/user/user.module';
import { WarehouseModule } from './api/warehouse/warehouse.module';
import { DatabaseModule } from './database/database.module';
import authConfig from './lib/configs/auth.config';
import serverConfig from './lib/configs/server.config';
import { UserActionInterceptor } from './lib/interceptors/user-action.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [serverConfig, authConfig],
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    LoggerModule.forRoot(),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UserModule,
    RoleModule,
    JournalModule,
    WarehouseModule,
    BatchModule,
    ItemModule,
    TaskModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: UserActionInterceptor,
    },
  ],
})
export class AppModule {}
