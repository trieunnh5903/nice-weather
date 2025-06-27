import { fetchAstronomy } from "@/api/weatherApi";
import { weatherKeys } from "@/constants/queryKey";
import { useQuery } from "@tanstack/react-query";

export const useSunriseSunset = (lat?: string, lon?: string) =>
  useQuery({
    queryKey: weatherKeys.astronomy(lat ?? "", lon ?? ""),
    queryFn: () => fetchAstronomy(lat!, lon!),
    enabled: !!lat && !!lon,
  });
