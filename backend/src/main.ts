import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()) ?? [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://vargocargo.com',
      'https://www.vargocargo.com',
    ],
  });

  const port = Number(process.env.PORT ?? 5000);
  await app.listen(port, '0.0.0.0');
}
bootstrap();
