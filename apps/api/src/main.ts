import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // const globalPrefix = 'api';
  // app.setGlobalPrefix(globalPrefix);
  // const port = process.env.PORT || 3333;
  // await app.listen(port);
  // Logger.log(
  //   `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  // );

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const configService = app.get(ConfigService)
  const port = configService.get('PORT');
  const env = configService.get('NODE_ENV');
  await app.listen(port);

  Logger.log(`🚀 Server Started on: http://localhost:${port}/${globalPrefix}`);
  Logger.warn(`🟧 Application running In ${env} Mode`);
  // Logger.log(`🟩 Info`);
  // Logger.warn(`🟧 Wanrning`);
  // Logger.error(`🟥 Error`)
}

bootstrap();
