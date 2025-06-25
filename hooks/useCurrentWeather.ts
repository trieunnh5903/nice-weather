import { fetchCurrentWeather } from "@/api/weatherApi";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "./useLanguage";
import { weatherKeys } from "@/constants/queryKey";

export const useCurrentWeather = (lat?: string, lon?: string) => {
  const { currentLanguage } = useLanguage();
  return useQuery({
    queryKey: weatherKeys.current(lat ?? "", lon ?? "", currentLanguage),
    queryFn: () => fetchCurrentWeather(lat!, lon!, currentLanguage),
    enabled: !!lat && !!lon && !!currentLanguage,
  });
};
