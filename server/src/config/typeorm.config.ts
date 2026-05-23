import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { join } from "path";

function parseDatabaseUrl(url: string) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: Number(parsed.port) || 5432,
    username: parsed.username,
    password: parsed.password,
    database: parsed.pathname.replace(/^\//, ""),
  };
}

const databaseUrl = process.env.DATABASE_URL;

const connection = databaseUrl
  ? parseDatabaseUrl(databaseUrl)
  : {
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.DB_NAME || "student_collab",
    };

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: "postgres",
  ...connection,
  synchronize: process.env.NODE_ENV !== "production",
  entities: [join(__dirname, "/../**/*.entity.{js,ts}")],
};
