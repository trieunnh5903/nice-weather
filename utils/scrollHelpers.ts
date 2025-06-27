export const getSnappedOffset = (
  offset: number,
  max: number
): number | null => {
  if (offset > max || offset === 0) return null;
  if (offset < max / 2) return 0;
  if (offset > max / 2) return max;
  return null;
};
