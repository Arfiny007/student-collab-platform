import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ Validation
  app.useGlobalPipes(new ValidationPipe());

  // ✅ Serve uploaded files (CORRECT WAY)
  app.useStaticAssets(join(__dirname, '..', 'uploads'));

  // ✅ CORS
  app.enableCors({
    origin: '*',
  });

  await app.listen(process.env.PORT ?? 5000, '0.0.0.0');
}

bootstrap();