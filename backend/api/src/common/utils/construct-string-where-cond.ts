import { ILike } from 'typeorm';

export function constructDynamicWhereConditions(
  fields: { field: string; value: string }[],
): any {
  const whereConditions: any = {};

  fields.forEach(({ field, value }) => {
    if (value) {
      whereConditions[field] = ILike(`%${value}%`);
    }
  });

  return whereConditions;
}
