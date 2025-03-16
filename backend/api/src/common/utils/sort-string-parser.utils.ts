export function parseSortString(
  sortString: string,
): Record<string, 'ASC' | 'DESC'> {
  if (!sortString) return {};
  return sortString.split(',').reduce(
    (acc, sortField: string) => {
      const [field, order] = sortField.split(':');
      if (order !== 'ASC' && order !== 'DESC') {
        throw new Error(`Invalid sort order: ${order}`);
      }
      acc[field] = order as 'ASC' | 'DESC';
      return acc;
    },
    {} as Record<string, 'ASC' | 'DESC'>,
  );
}
