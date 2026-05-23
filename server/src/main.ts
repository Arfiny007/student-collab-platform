import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, Logger } from "@nestjs/common";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as fs from "fs";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { HttpExceptionFilter } from "./common/http-exception.filter";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  const app =
    await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        statusCode: 429,
        message: "Too many requests, please try again later.",
      },
    }),
  );

  const uploadsPath = join(__dirname, "..", "uploads");
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }

  app.useStaticAssets(uploadsPath);

  const clientUrl = process.env.CLIENT_URL;
  const allowedOrigins = clientUrl
    ? clientUrl.split(",").map((o) => o.trim())
    : [];

 /* app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0) {
        callback(null, true);
        return;
      }
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  });*/
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = Number(process.env.PORT) || 5000;
  await app.listen(port, "0.0.0.0");
  logger.log(`Server listening on port ${port}`);
}

bootstrap();
