import { Injectable } from '@nestjs/common';
import { Policlinic } from './entities/policlinic.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateCurrStateAnalysisDto } from './dto/create-curr-state-analysis.dto';
import { PopulationService } from 'src/population/population.service';
import { CreateProjectAnalysisDto } from './dto/create-project-analysis.dto';

@Injectable()
export class HealthcareService {
  constructor(
    @InjectRepository(Policlinic)
    private readonly policlinicRepository: Repository<Policlinic>,
    private readonly populationService: PopulationService,
  ) {}

  private kidsRequireCoeff = 0.0058;
  private adultRequireCoeff = 0.0132;
  private profitMinPercentage = 100;
  private profitMaxPercentage = 178;

  private isInProfitRange(value: number): boolean {
    return (
      value >= this.profitMinPercentage && value <= this.profitMaxPercentage
    );
  }

  private transformCurrentStateData(data: any[]) {
    const typeMapping = {
      Смешанное: 'Смешанные поликлиники',
      Детское: 'Детские поликлиники',
      Взрослое: 'Взрослые поликлиники',
    };

    let totalWorkloadAdults = 0;
    let totalWorkloadKids = 0;
    let totalAttachedAdults = 0;
    let totalAttachedKids = 0;
    let totalKidsCapacity = 0;
    let totalAdultCapacity = 0;
    let typesCount = 0;

    const selectedData = data.map((item) => {
      const capacityAdults = item.capacity_adults || 0;
      const capacityKids = item.capacity_kids || 0;

      if (capacityKids) {
        totalKidsCapacity += capacityKids;
      }

      if (capacityAdults) {
        totalAdultCapacity += capacityAdults;
      }

      if (item.workload_adults !== null) {
        totalWorkloadAdults += item.workload_adults;
        typesCount++;
      }
      if (item.workload_kids !== null) {
        totalWorkloadKids += item.workload_kids;
      }
      if (item.attached_adults !== null) {
        totalAttachedAdults += item.attached_adults;
      }
      if (item.attached_kids !== null) {
        totalAttachedKids += item.attached_kids;
      }

      return {
        type: typeMapping[item.type] || item.type,
        count: item.count,
        capacity: capacityAdults + capacityKids,
      };
    });

    const avgWorkloadAdults = Math.round(
      totalWorkloadAdults / (typesCount || 1),
    );
    const avgWorkloadKids = Math.round(totalWorkloadKids / (data.length || 1));

    const isProfitableByAdultWorkload = this.isInProfitRange(avgWorkloadAdults);
    const isProfitableByKidsWorkload = this.isInProfitRange(avgWorkloadKids);

    return {
      selectedData,
      workloads: {
        adults: {
          isProfitable: isProfitableByAdultWorkload,
          value: avgWorkloadAdults,
        },
        kids: {
          isProfitable: isProfitableByKidsWorkload,
          value: avgWorkloadKids,
        },
      },
      attached: {
        adults: totalAttachedAdults,
        kids: totalAttachedKids,
      },
      totalCapacity: {
        adults: totalKidsCapacity,
        kids: totalAdultCapacity,
      },
    };
  }

  private createProjectRecommendation(profitability: any) {
    const { kids, adults } = profitability;

    if (kids && adults) {
      return 'Отсутствуют';
    }
    if (!kids && !adults) {
      return ['Смешанная поликлиника'];
    }

    if (!kids) {
      return ['Детская поликлиника'];
    }

    return 'Взрослая поликиника';
  }

  private async getCurrentStatePoliclinicsData(ids: number[]) {
    const data = await this.policlinicRepository
      .createQueryBuilder('p')
      .select('p.type', 'type')
      .addSelect('COUNT(*)::int', 'count')
      .addSelect('SUM(p.design_capacity_adults)::int', 'capacity_adults')
      .addSelect('SUM(p.design_capacity_kids)::int', 'capacity_kids')
      .addSelect('AVG(p.workload_kids)::int', 'workload_kids')
      .addSelect('AVG(p.workload_adults)::int', 'workload_adults')
      .addSelect('SUM(p.attached_adults)::int', 'attached_adults')
      .addSelect('SUM(p.attached_kids)::int', 'attached_kids')
      .where('p.id IN (:...ids)', { ids })
      .groupBy('p.type')
      .getRawMany();

    return this.transformCurrentStateData(data);
  }

  private async findPoliclinicsByProjIsochrone(isochrone: string) {
    const query = `
      WITH isochrone AS (
          SELECT ST_SetSRID(ST_GeomFromText($1), 4326) AS geom
      )
    SELECT
      COALESCE(SUM(p.design_capacity_kids)::int, 0) AS design_capacity_kids,
      COALESCE(SUM(p.design_capacity_adults)::int, 0) AS design_capacity_adults,
      COALESCE(SUM(p.workload_kids)::int, 0) AS workload_kids,
      COALESCE(SUM(p.workload_adults)::int, 0) AS workload_adults
    FROM
      healthcare.policlinics p, isochrone i
    WHERE
      ST_Intersects(p.geom, i.geom);
  `;

    const result = await this.policlinicRepository.query(query, [isochrone]);
    return result[0];
  }

  async createCurrentStateAnalysis({
    ids,
    isochrones,
  }: CreateCurrStateAnalysisDto) {
    const { selectedData, workloads, attached, totalCapacity } =
      await this.getCurrentStatePoliclinicsData(ids);
    const populationWithinIsochrones =
      await this.populationService.findPopulationSumByIsochroneIntersections(
        isochrones,
      );

    const attachedPopReqs = {
      kids: Math.ceil(attached.kids * this.kidsRequireCoeff),
      adults: Math.ceil(attached.adults * this.adultRequireCoeff),
    };

    const withinIsoPopReqs = {
      kids: Math.ceil(populationWithinIsochrones * this.kidsRequireCoeff),
      adults: Math.ceil(populationWithinIsochrones * this.adultRequireCoeff),
    };

    const totalRequirements = {
      kids: totalCapacity.kids - withinIsoPopReqs.kids,
      adults: totalCapacity.adults - withinIsoPopReqs.adults,
    };

    return {
      selectedData,
      workloads,
      //   totalCapacity,
      //   totalPopulation: {
      //     attached: {
      //       kids: attached.kids,
      //       adults: attached.adults,
      //     },
      //     withinIsochrone: populationWithinIsochrones,
      //   },
      populationData: {
        attached: attachedPopReqs,
        withinIsochrone: withinIsoPopReqs,
      },
      totalRequirements,
    };
  }

  async createProjectAnalysis({
    projectAreaIsochrone,
    polyclinicIsochrones,
    adultsRequirement,
    kidsRequirement,
    projectPopulation,
  }: CreateProjectAnalysisDto) {
    let projKidsRequirement;
    let projAdultsRequirement;

    if (projectPopulation) {
      projKidsRequirement = Math.ceil(
        projectPopulation * this.kidsRequireCoeff,
      );
      projAdultsRequirement = Math.ceil(
        projectPopulation * this.adultRequireCoeff,
      );
    } else {
      projKidsRequirement = kidsRequirement;
      projAdultsRequirement = adultsRequirement;
    }

    const populationWithinIsochrones =
      await this.populationService.findPopulationSumByIsochroneIntersections([
        projectAreaIsochrone,
        ...polyclinicIsochrones,
      ]);

    const populationRequirements = {
      kids: Math.ceil(populationWithinIsochrones * this.kidsRequireCoeff),
      adults: Math.ceil(populationWithinIsochrones * this.adultRequireCoeff),
    };

    const resultRequirements = {
      kids: populationRequirements.kids + projKidsRequirement,
      adults: populationRequirements.adults + projAdultsRequirement,
    };

    const policlinicsWithinIso =
      await this.findPoliclinicsByProjIsochrone(projectAreaIsochrone);

    const resultWorkloads = {
      kids: Math.ceil(
        (policlinicsWithinIso.design_capacity_kids / resultRequirements.kids) *
          100,
      ),
      adults: Math.ceil(
        (policlinicsWithinIso.design_capacity_adults /
          resultRequirements.adults) *
          100,
      ),
    };

    const resultProfitability = {
      kids: this.isInProfitRange(resultWorkloads.kids),
      adults: this.isInProfitRange(resultWorkloads.adults),
    };

    const resultDifference = {
      kids: policlinicsWithinIso.design_capacity_kids - resultRequirements.kids,
      adults:
        policlinicsWithinIso.design_capacity_adults - resultRequirements.adults,
    };

    const recommendation =
      this.createProjectRecommendation(resultProfitability);

    return {
      results: {
        kids: {
          isProfitable: resultProfitability.kids,
          isProficit: resultDifference.kids > 0,
          difference: resultDifference.kids,
          workload: resultWorkloads.kids,
        },
        adults: {
          isProfitable: resultProfitability.adults,
          isProficit: resultDifference.adults > 0,
          difference: resultDifference.adults,
          workload: resultWorkloads.adults,
        },
      },
      recommendation,
    };
  }
}
