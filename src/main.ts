import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { ServerConfig } from './lib/types/configs/server';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  const configService = app.get<ConfigService>(ConfigService);
  const serverConfig = configService.get<ServerConfig>('server');
  app.enableCors({
    origin: serverConfig.cors.origin,
    methods: serverConfig.cors.methods,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true,
      },
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const options = new DocumentBuilder()
    .setTitle('API WMS Doxa docs')
    .setDescription('WMS Doxa API documentation')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  app.listen(serverConfig.port, () => {
    logger.log(
      `Docs available at http://${serverConfig.host}:${serverConfig.port}/api`,
    );
    logger.log(
      `Server listening at http://${serverConfig.host}:${serverConfig.port}`,
    );
  });
}

bootstrap();
