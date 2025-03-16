import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Point } from 'typeorm/driver/types/GeoJsonTypes';

@Entity({ schema: 'public', name: 'population' })
export class Population {
  @PrimaryColumn()
  fid: number;

  @Column('geometry', { spatialFeatureType: 'Point', srid: 4326 })
  geom: Point;

  @Column({ type: 'bigint', nullable: true })
  id: number;

  @Column({ type: 'float8', nullable: true })
  orbis_id: number;

  @Column({ type: 'varchar', nullable: true })
  ao: string;

  @Column({ type: 'varchar', nullable: true })
  raion: string;

  @Column({ type: 'varchar', nullable: true })
  adr: string;

  @Column({ type: 'float8', nullable: true })
  unom: number;

  @Column({ type: 'varchar', nullable: true })
  types: string;

  @Column({ type: 'float8', nullable: true })
  population_stat: number;

  @Column({ type: 'float8', nullable: true })
  populati_eirs: number;

  @Column({ type: 'varchar', nullable: true })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  date_record: Date;

  @Column({ type: 'float8', nullable: true })
  ex_population: number;

  @Column({ type: 'float8', nullable: true })
  proj_population: number;
}
