import { Module } from '@nestjs/common';
import { DatabaseQueryModule } from './database-queries/database-query.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { PresentationModule } from './presentation/presentation.module';
import dbConfig from './database/config/db.config';
import dbProductionConfig from './database/config/db-production.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
      load: [dbConfig, dbProductionConfig],
    }),
    DatabaseQueryModule,
    DatabaseModule,
    PresentationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
