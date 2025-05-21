import { Controller } from '@nestjs/common';
import { PopulationService } from './population.service';

@Controller('population')
export class PopulationController {
  constructor(private readonly populationService: PopulationService) {}
}
