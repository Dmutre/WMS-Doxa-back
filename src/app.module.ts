import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClsModule } from 'nestjs-cls';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './api/auth/auth.module';
import { JournalModule } from './api/journal/journal.module';
import { RoleModule } from './api/role/role.module';
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
    DatabaseModule,
    AuthModule,
    UserModule,
    RoleModule,
    JournalModule,
    WarehouseModule,
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
