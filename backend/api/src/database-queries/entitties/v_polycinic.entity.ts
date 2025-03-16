import { ViewEntity, ViewColumn, Point } from 'typeorm';

@ViewEntity({ schema: 'public', name: 'v_polyclinic' })
export class VPolyclinic {
  @ViewColumn()
  id: number;

  @ViewColumn()
  branch_name: string;

  @ViewColumn()
  type: string;

  @ViewColumn()
  attached_adults: number;

  @ViewColumn()
  attached_kids: number;

  @ViewColumn()
  design_capacity_adults: number;

  @ViewColumn()
  design_capacity_kids: number;

  @ViewColumn()
  actual_capacity_adults: number;

  @ViewColumn()
  actual_capacity_kids: number;

  @ViewColumn()
  surplus_adults: number;

  @ViewColumn()
  surplus_kids: number;

  @ViewColumn()
  workload_adults: number;

  @ViewColumn()
  workload_kids: number;

  @ViewColumn()
  deficit_adults: number;

  @ViewColumn()
  deficit_kids: number;

  @ViewColumn()
  geom: Point;
}
