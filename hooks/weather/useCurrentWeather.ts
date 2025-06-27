import { fetchCurrentWeather } from "@/api/weatherApi";
import { useQuery } from "@tanstack/react-query";
import { weatherKeys } from "@/constants/queryKey";
import { LanguageCode } from "@/types/common/language";

export const useCurrentWeather = (
  lat: string,
  lon: string,
  language: LanguageCode
) => {
  return useQuery({
    queryKey: weatherKeys.current(lat ?? "", lon ?? "", language ?? ""),
    queryFn: () => fetchCurrentWeather(lat!, lon!, language!),
    enabled: !!lat && !!lon && !!language,
  });
};
