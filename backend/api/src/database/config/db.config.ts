import { registerAs } from '@nestjs/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export default registerAs(
  'dbconfig.dev',
  (): PostgresConnectionOptions => ({
    type: 'postgres',
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT || 5434),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    synchronize: false,
    // schema: process.env.DB_SCHEMAS.split(','),
    extra: {
      searchPath: process.env.DB_SCHEMAS?.split(',') || ['healthcare'],
    },
    entities: [__dirname + '/../../**/*.entity{.js,.ts}'],
    // dropSchema: true,
  }),
);
