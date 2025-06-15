import { QueryClient } from "@tanstack/react-query";

export const createQueryClient = (staleTime: number) => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: staleTime < 0 ? Infinity : staleTime * 1000,
        gcTime: 24 * 24 * 3600 * 1000,
      },
    },
  });
};
