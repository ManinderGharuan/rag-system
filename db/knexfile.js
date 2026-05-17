import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
  quiet: true,
});

const shared = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: {
    min: Number(process.env.DB_POOL_MIN || 2),
    max: Number(process.env.DB_POOL_MAX || 10),
  },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations',
  },
};

export default {
  development: shared,
  test: shared,
  production: shared,
};
