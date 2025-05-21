import { Body, Controller, Post } from '@nestjs/common';
import { HealthcareService } from './healthcare.service';
import { CreateCurrStateAnalysisDto } from './dto/create-curr-state-analysis.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateProjectAnalysisDto } from './dto/create-project-analysis.dto';

@ApiTags('Здравоохранение')
@Controller('healthcare')
export class HealthcareController {
  constructor(private readonly healthcareService: HealthcareService) {}

  @Post('current-state')
  async createCurrentStateAnalysis(@Body() dto: CreateCurrStateAnalysisDto) {
    return await this.healthcareService.createCurrentStateAnalysis(dto);
  }

  @Post('project')
  async createProjectAnalysis(@Body() dto: CreateProjectAnalysisDto) {
    return await this.healthcareService.createProjectAnalysis(dto);
  }
}
