import { Injectable } from '@nestjs/common';
import { DatatabaseQueryService } from 'src/database-queries/database-query.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';

@Injectable()
export class AnalysisService {
  constructor(private readonly databaseQueryService: DatatabaseQueryService) {}

  private getPopulationRequirements(populationData: {
    total_population_isochrone_min: number;
    total_population_isochrone_max: number;
  }) {
    const minZonePopulation =
      populationData.total_population_isochrone_min || 0;
    const maxZonePopulation =
      populationData.total_population_isochrone_max || 0;

    const totalPopulation = minZonePopulation + maxZonePopulation;

    const childCoefficient = 5.8 / 1000;
    const adultCoefficient = 13.2 / 1000;

    const calculateRequirements = (population: number) => ({
      requireChild: Math.round(population * childCoefficient),
      requireAdult: Math.round(population * adultCoefficient),
    });

    return {
      total: {
        population: totalPopulation,
        ...calculateRequirements(totalPopulation),
      },
      isochrone_min: {
        population: minZonePopulation,
        ...calculateRequirements(minZonePopulation),
      },
      isochrone_max: {
        population: maxZonePopulation,
        ...calculateRequirements(maxZonePopulation),
      },
    };
  }

  async createAnalysis({
    polyclinicsIsochrone,
    projectAreaIsochrone,
  }: CreateAnalysisDto) {
    const populationData =
      await this.databaseQueryService.findPopulationSumByIsochroneIntersections(
        projectAreaIsochrone,
        polyclinicsIsochrone,
      );

    const populationRequirements = this.getPopulationRequirements(
      populationData[0],
    );

    const policlinicsRequirements =
      await this.databaseQueryService.findPolicilinicsSumByIsochroneIntersection(
        projectAreaIsochrone,
      );

    return {
      populationData: { ...populationRequirements },
      policlinicsData: { ...policlinicsRequirements[0] },
    };
  }
}
