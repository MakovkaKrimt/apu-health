import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  Geometry,
  Point,
} from 'typeorm';

@Entity({ name: 'population', schema: 'common' })
export class Population {
  @PrimaryGeneratedColumn({ name: 'fid', type: 'int8' })
  fid: number;

  @Column({
    name: 'geom',
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  geom: Point;

  @Column({ name: 'id', type: 'int8', nullable: true })
  id: number;

  @Column({ name: 'orbis_id', type: 'float8', nullable: true })
  orbisId: number;

  @Column({ name: 'ao', type: 'varchar', nullable: true })
  ao: string;

  @Column({ name: 'raion', type: 'varchar', nullable: true })
  raion: string;

  @Column({ name: 'adr', type: 'varchar', nullable: true })
  adr: string;

  @Column({ name: 'unom', type: 'float8', nullable: true })
  unom: number;

  @Column({ name: 'types', type: 'varchar', nullable: true })
  types: string;

  @Column({ name: 'population_stat', type: 'float8', nullable: true })
  populationStat: number;

  @Column({ name: 'populati_eirs', type: 'float8', nullable: true })
  populationEirs: number;

  @Column({ name: 'status', type: 'varchar', nullable: true })
  status: string;

  @Column({ name: 'date_record', type: 'timestamp', nullable: true })
  dateRecord: Date;

  @Column({ name: 'ex_population', type: 'float8', nullable: true })
  exPopulation: number;

  @Column({ name: 'proj_population', type: 'float8', nullable: true })
  projPopulation: number;
}
