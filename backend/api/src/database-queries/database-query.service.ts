import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VPoliclinic } from './entitties/v_polycinic.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DatatabaseQueryService {
  constructor(
    @InjectRepository(VPoliclinic)
    private readonly vpoliclinicRepository: Repository<VPoliclinic>,
  ) {}

  async transformProjectSiteToPPTXScale(extent: string, projectSite: string) {
    const query = `
          WITH extent AS (
              SELECT ST_SetSRID(ST_GeomFromText($1), 4326) AS geom
          ),
          site AS (
              SELECT ST_SetSRID(ST_GeomFromText($2), 4326) AS geom
          )
          SELECT
              ST_X(points.geom) AS x,
              ST_Y(points.geom) AS y
          FROM extent e, site s
          JOIN LATERAL (
              SELECT __transform_to_prez_scale(e.geom, s.geom, 163.7, 166.5, 26.0, 64.0) AS geom
          ) AS points ON true
      `;
    const policlinicsData = await this.vpoliclinicRepository.query(query, [
      extent,
      projectSite,
    ]);

    return policlinicsData;
  }

  async findPoliclinicsByExtentIntersection(extent: string) {
    const query = `
        WITH extent AS (
            SELECT ST_SetSRID(ST_GeomFromText($1), 4326) AS geom
        ),
        points AS (
            SELECT
                v.type,
                ST_X(points.geom) AS x,
                ST_Y(points.geom) AS y
            FROM extent e
            JOIN v_policlinics v ON ST_Intersects(e.geom, v.geom)
            JOIN LATERAL (
                SELECT __transform_to_prez_scale(e.geom, v.geom, 163.7, 166.5, 26.0, 64.0) AS geom
            ) AS points ON true
        )
        SELECT * FROM points;
      `;
    const policlinicsData = await this.vpoliclinicRepository.query(query, [
      extent,
    ]);

    return policlinicsData;
  }

  async findPolicilinicsSumByIsochroneIntersection(
    projectAreaIsochrone: string,
  ) {
    const query = `    
      WITH isochrone_min AS (
          SELECT ST_Union(ST_SetSRID(ST_GeomFromText($1), 4326)) AS geom
      ),
      subquery as (
      SELECT 
          SUM(COALESCE(v.surplus_kids, 0) + COALESCE(v.deficit_kids, 0))::integer  AS total_child,
          SUM(COALESCE(v.surplus_adults, 0) + COALESCE(v.deficit_adults, 0))::integer  AS total_adult,
          COUNT(*) FILTER (WHERE type = 'детская')::integer AS child_count,
          COUNT(*) FILTER (WHERE type = 'взрослая')::integer AS adult_count,
          COUNT(*) FILTER (WHERE type = 'смешанная')::integer AS mixed_count
      FROM
          v_policlinics v,
          isochrone_min imin
      WHERE
          ST_Intersects(v.geom, imin.geom)
        )
        SELECT 
          s.*,
          s.child_count + s.adult_count + s.mixed_count as total_count
        FROM subquery s;
        `;

    const policlinicsData = await this.vpoliclinicRepository.query(query, [
      projectAreaIsochrone,
    ]);

    return policlinicsData;
  }

  async findPopulationSumByIsochroneIntersections(
    projectAreaIsochrone: string,
    policlinicsIsochrone: string,
  ) {
    const query = `
    WITH isochrone_min AS (
        SELECT 
            ST_SetSRID(ST_GeomFromText($1), 4326) AS geom),
    isochrone_max AS (
        SELECT ST_Union(ST_SetSRID(ST_GeomFromText($2), 4326)) AS geom
    )
    SELECT
        SUM(CASE WHEN ST_Intersects(p.geom, ST_Difference(imin.geom, imax.geom)) THEN p.population_stat ELSE 0 END) AS total_population_isochrone_min,
        SUM(CASE WHEN ST_Intersects(p.geom, ST_Difference(imax.geom, imin.geom)) THEN p.population_stat ELSE 0 END) AS total_population_isochrone_max
    FROM
        population p,
        isochrone_min imin,
        isochrone_max imax
    WHERE
        ST_Intersects(p.geom, ST_Union(imin.geom, imax.geom));
      `;
    const populationData = await this.vpoliclinicRepository.query(query, [
      projectAreaIsochrone,
      policlinicsIsochrone,
    ]);

    return populationData;
  }

  async findPopulationByProjAreaIsochroneIntersection(
    projectAreaIsochrone: string,
  ) {
    const query = `
    WITH isochrone_min AS (
        SELECT 
            ST_SetSRID(ST_GeomFromText($1), 4326) AS geom)
    SELECT
        SUM(p.population_stat) AS total_population_isochrone_min
    FROM
        population p,
        isochrone_min imin
    WHERE
        ST_Intersects(p.geom, imin.geom);
      `;
    const populationData = await this.vpoliclinicRepository.query(query, [
      projectAreaIsochrone,
    ]);

    return populationData;
  }
}
