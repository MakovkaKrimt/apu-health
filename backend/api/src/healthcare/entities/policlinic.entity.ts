import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Geometry,
  Point,
} from 'typeorm';

@Entity({ name: 'policlinics', schema: 'healthcare' })
export class Policlinic {
  @PrimaryGeneratedColumn('identity', { name: 'id' })
  id: number;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  geom: Point;

  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  type: string;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ name: 'attached_kids', type: 'int', nullable: true })
  attachedKids: number;

  @Column({ name: 'attach_adults', type: 'int', nullable: true })
  attachedAdults: number;

  @Column({ name: 'design_capacity_kids', type: 'int', nullable: true })
  designCapacityKids: number;

  @Column({ name: 'design_capacity_adults', type: 'int', nullable: true })
  designCapacityAdults: number;

  @Column({ name: 'actual_capacity_kids', type: 'int', nullable: true })
  actualCapacityKids: number;

  @Column({ name: 'actual_capacity_adults', type: 'int', nullable: true })
  actualCapacityAdults: number;

  @Column({ name: 'workload_kids', type: 'int', nullable: true })
  workloadKids: number;

  @Column({ name: 'workload_adults', type: 'int', nullable: true })
  workloadAdults: number;

  @Column({ name: 'surplus_kids', type: 'int', nullable: true })
  surplusKids: number;

  @Column({ name: 'surplus_adults', type: 'int', nullable: true })
  surplusAdults: number;

  @Column({ name: 'deficit_kids', type: 'int', nullable: true })
  deficitKids: number;

  @Column({ name: 'deficit_adults', type: 'int', nullable: true })
  deficitAdults: number;
}
