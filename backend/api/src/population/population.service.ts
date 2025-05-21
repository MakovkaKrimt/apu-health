import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Population } from './enities/population.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PopulationService {
  constructor(
    @InjectRepository(Population)
    private readonly populationRepository: Repository<Population>,
  ) {}

  async findPopulationSumByIsochroneIntersections(isochrones: string[]) {
    const query = `
    WITH isochrone_geoms AS (
      SELECT UNNEST($1::text[]) AS wkt
    ),
    combined_isochrones AS (
      SELECT ST_Union(ST_GeomFromText(wkt, 4326)) AS geom
      FROM isochrone_geoms
    )
    SELECT
      COALESCE(SUM(p.population_stat), 0) AS population
    FROM
      common.population p, combined_isochrones ci
    WHERE
      p.population_stat IS NOT NULL AND ST_Intersects(p.geom, ci.geom);
  `;

    const result = await this.populationRepository.query(query, [isochrones]);
    return result[0].population;
  }
}
