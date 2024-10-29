import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './api/auth/auth.module';
import { RoleModule } from './api/role/role.module';
import { UserModule } from './api/user/user.module';
import { DatabaseModule } from './database/database.module';
import authConfig from './lib/configs/auth.config';
import serverConfig from './lib/configs/server.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [serverConfig, authConfig],
    }),
    LoggerModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UserModule,
    RoleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
