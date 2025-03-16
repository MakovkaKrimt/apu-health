import { FindOptionsSelect } from 'typeorm';

export function constructSelectOptions<T>(
  fields: string[],
): FindOptionsSelect<T> {
  return fields.reduce(
    (acc, field) => {
      acc[field] = true;
      return acc;
    },
    { id: true } as unknown as FindOptionsSelect<T>,
  );
}
