export const getNextIndex = (currentIndex: number, total: number): number => {
  return currentIndex === total - 1 ? 0 : currentIndex + 1;
};

export const getPreviousIndex = (
  currentIndex: number,
  total: number
): number => {
  return currentIndex === 0 ? total - 1 : currentIndex - 1;
};
