import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as fs from 'fs';


const envPath = `.env.${process.env.NODE_ENV || 'local'}`;
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config(); // fallback to .env
}


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
  });
  await app.listen(parseInt(process.env.AI_PORT || '3001', 10));}
bootstrap();