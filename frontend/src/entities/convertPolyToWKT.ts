export const convertExtentToWKT = (
  extent: [number, number, number, number]
) => {
  const [minX, minY, maxX, maxY] = extent;

  return `POLYGON((
      ${minX} ${minY},
      ${maxX} ${minY},
      ${maxX} ${maxY},
      ${minX} ${maxY},
      ${minX} ${minY}
    ))`;
};
