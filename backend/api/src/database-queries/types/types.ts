export interface IPoliclinicRequirements {
  totalChild: number;
  totalAdult: number;
  childCount: number;
  adultCount: number;
  mixedCount: number;
  totalCount: number;
}

export interface IPopulationDBResult {
  totalPopulationIsochroneMin: number;
  totalPopulationIsochroneMax: number;
}

export interface IPopulationStats {
  population: number;
  requireChild: number;
  requireAdult: number;
}

export interface IPopulationRequirements {
  total: IPopulationStats;
  isochroneMin: IPopulationStats;
  isochroneMax: IPopulationStats;
}
