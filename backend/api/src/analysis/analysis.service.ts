import { Injectable } from '@nestjs/common';
import { DatatabaseQueryService } from 'src/database-queries/database-query.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { transformKeysToCamelCase } from '@common/utils/transfrom-to-camel-case';
import {
  IPoliclinicRequirements,
  IPopulationDBResult,
  IPopulationRequirements,
} from 'src/database-queries/types/types';

@Injectable()
export class AnalysisService {
  constructor(private readonly databaseQueryService: DatatabaseQueryService) {}

  private getPopulationRequirements(
    populationData: IPopulationDBResult,
  ): IPopulationRequirements {
    const minZonePopulation = populationData.totalPopulationIsochroneMin || 0;
    const maxZonePopulation = populationData.totalPopulationIsochroneMax || 0;

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
      isochroneMin: {
        population: minZonePopulation,
        ...calculateRequirements(minZonePopulation),
      },
      isochroneMax: {
        population: maxZonePopulation,
        ...calculateRequirements(maxZonePopulation),
      },
    };
  }

  private getTotalRequirements(
    policlinicsRequirements: IPoliclinicRequirements,
    populationRequirements: IPopulationRequirements,
  ) {
    const { requireChild, requireAdult } = populationRequirements.total;

    return {
      populationData: { ...populationRequirements },
      policlinicsRequirements: { ...policlinicsRequirements },
      total: {
        requireChild: requireChild - policlinicsRequirements.totalChild,
        requireAdult: requireAdult - policlinicsRequirements.totalAdult,
      },
    };
  }

  async createAnalysis({
    polyclinicsIsochrone,
    projectAreaIsochrone,
  }: CreateAnalysisDto) {
    let populationRequirements;

    if (!polyclinicsIsochrone) {
      const populationData =
        await this.databaseQueryService.findPopulationByProjAreaIsochroneIntersection(
          projectAreaIsochrone,
        );

      const transformedPopulationData = transformKeysToCamelCase(
        populationData[0],
      );

      populationRequirements = this.getPopulationRequirements(
        transformedPopulationData,
      );

      return {
        populationData: { ...populationRequirements },
      };
    }

    const populationData =
      await this.databaseQueryService.findPopulationSumByIsochroneIntersections(
        projectAreaIsochrone,
        polyclinicsIsochrone,
      );

    const transformedPopulationData = transformKeysToCamelCase(
      populationData[0],
    );

    populationRequirements = this.getPopulationRequirements(
      transformedPopulationData,
    );

    const policlinicsData =
      await this.databaseQueryService.findPolicilinicsSumByIsochroneIntersection(
        projectAreaIsochrone,
      );

    const policlinicsRequirements: IPoliclinicRequirements =
      transformKeysToCamelCase(policlinicsData[0]);

    return this.getTotalRequirements(
      policlinicsRequirements,
      populationRequirements,
    );
  }
}
