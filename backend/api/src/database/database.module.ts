import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import dbProductionConfig from './config/db-production.config';
import dbConfig from './config/db.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV === 'production' ? dbProductionConfig : dbConfig,
    }),
  ],
  exports: [DatabaseModule],
})
export class DatabaseModule {}
