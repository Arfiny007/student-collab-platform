import {
  NestFactory,
} from "@nestjs/core";

import {
  AppModule,
} from "./app.module";

import {
  ValidationPipe,
} from "@nestjs/common";

import {
  join,
} from "path";

import {
  NestExpressApplication,
} from "@nestjs/platform-express";

import * as fs from "fs";

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(
      AppModule,
    );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted:
        true,
      transform: true,
    }),
  );

  if (
  !fs.existsSync(
    "uploads",
  )
) {
  fs.mkdirSync(
    "uploads",
  );
}

  app.useStaticAssets(
    join(
      __dirname,
      "..",
      "uploads",
    ),
  );

  app.enableCors({
    origin: "*",
  });

  await app.listen(
    process.env.PORT ||
      5000,
    "0.0.0.0",
  );
}

bootstrap();