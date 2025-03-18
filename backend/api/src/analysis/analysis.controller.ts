import { Body, Controller, Post } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post()
  async createAnalysis(@Body() dto: CreateAnalysisDto) {
    return await this.analysisService.createAnalysis(dto);
  }
}
