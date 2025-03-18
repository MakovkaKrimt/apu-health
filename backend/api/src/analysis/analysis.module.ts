import { Module } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { DatabaseQueryModule } from 'src/database-queries/database-query.module';

@Module({
  imports: [DatabaseQueryModule],
  controllers: [AnalysisController],
  providers: [AnalysisService],
})
export class AnalysisModule {}
