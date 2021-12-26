import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // app.enableCors({ origin: true, credentials: true });
  app.enableCors();
  app.use(cookieParser());
  await app.listen(4000);
}
bootstrap();
