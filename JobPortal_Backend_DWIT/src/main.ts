import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cors from 'cors';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as cookieParser from 'cookie-parser';

import MeiliSearch from 'meilisearch';
// import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const client = new MeiliSearch({
    host: 'http://127.0.0.1:7700',
    apiKey: 'aSampleMasterKey',
  });

  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new ValidationPipe());
  // app.use(cors())
  const corsOptions: CorsOptions = {
    // for development, will be changed in production
    origin: process.env.CLIENT,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  // app.enableCors(corsOptions);

  app.use(cookieParser());
  app.enableCors(corsOptions);
  await app.listen(8000);
}
bootstrap();
