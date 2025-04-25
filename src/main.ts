import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import cors from "cors";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    transform:true
  }))
  app.use('/stripe/webhook', bodyParser.raw({ type: 'application/json' }));
  app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
  }))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
