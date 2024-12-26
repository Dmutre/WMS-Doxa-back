import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ClsModule } from 'nestjs-cls';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './api/auth/auth.module';
import { BatchModule } from './api/batch/batch.module';
import { DeliveryModule } from './api/deliveries/delivery.module';
import { ItemModule } from './api/items/item.module';
import { JournalInterceptor } from './api/journal/interceptors/journal.interceptor';
import { JournalModule } from './api/journal/journal.module';
import { RoleModule } from './api/role/role.module';
import { TaskModule } from './api/tasks/task.module';
import { UserModule } from './api/user/user.module';
import { WarehouseModule } from './api/warehouse/warehouse.module';
import { DatabaseModule } from './database/database.module';
import authConfig from './lib/configs/auth.config';
import serverConfig from './lib/configs/server.config';

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
    DeliveryModule,
    TaskModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: JournalInterceptor,
    },
  ],
})
export class AppModule {}
