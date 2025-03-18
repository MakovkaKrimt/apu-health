// import { Injectable } from '@nestjs/common';
// import { DatatabaseQueryService } from 'src/database-queries/database-query.service';
// import { CreateAnalysisDto } from './dto/create-analysis.dto';

// @Injectable()
// export class AnalysisService {
//   constructor(private readonly databaseQueryService: DatatabaseQueryService) {}

//   private getPopulationRequirements(populationData: Record<string, number>) {
//     const minZonePopulation = populationData.min_zone_population || 0;
//     const maxZonePopulation = populationData.max_zone_population || 0;

//     const totalPopulation = minZonePopulation + maxZonePopulation;

//     const childCoefficient = 5.8 / 1000;
//     const adultCoefficient = 13.2 / 1000;

//     const calculateRequirements = (population: number) => ({
//       requireChild: Math.round(population * childCoefficient),
//       requireAdult: Math.round(population * adultCoefficient),
//     });

//     return {
//       total: {
//         population: totalPopulation,
//         ...calculateRequirements(totalPopulation),
//       },
//       isochrone_min: {
//         population: minZonePopulation,
//         ...calculateRequirements(minZonePopulation),
//       },
//       isochrone_max: {
//         population: maxZonePopulation,
//         ...calculateRequirements(maxZonePopulation),
//       },
//     };
//   }

//   async createAnalysis({
//     polyclinicsIsochrone,
//     projectAreaIsochrone,
//   }: CreateAnalysisDto) {
//     const populationData =
//       await this.databaseQueryService.findPopulationSumByPoliesIntersections(
//         projectAreaIsochrone,
//         polyclinicsIsochrone,
//       );
//     const populationRequirements =
//       this.getPopulationRequirements(populationData);

//     return populationData;
//   }
// }

//     def calculate_population_requirements(self, min_zone_population: float, max_zone_population: float):
//         return {
//             "min_zone_pop_child_req": round(min_zone_population / 1000 * 5.8),
//             "min_zone_pop_adult_req": round(min_zone_population / 1000 * 13.2),
//             "max_zone_pop_child_req": round(max_zone_population / 1000 * 5.8),
//             "max_zone_pop_adult_req": round(max_zone_population / 1000 * 13.2),
//         }

// напиши функцию getPopulationRequirements, которая аналогичном образом произведет вычисления и вернет объект

// {
//     total:{
//         population:95214,
//         requireChild: 11, #неправильные данные для примера
//         requireAdult: 16 #неправильные данные для примера
//     },
// 	isochrone_min:{
// 		population:5082,
//         requireChild: 5, #неправильные данные для примера
//         requireAdult: 10 #неправильные данные для примера
//     },
// 	isochrone_max:{
// 		population:90132,
//         requireChild: 6, #неправильные данные для примера
//         requireAdult: 6 #неправильные данные для примера
//     },
// }
