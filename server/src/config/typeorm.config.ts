import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'student_collab',

  synchronize: true,

  // ✅ SAFE + DOCKER FRIENDLY
  entities: [join(__dirname, '/../**/*.entity.{js,ts}')],
};
