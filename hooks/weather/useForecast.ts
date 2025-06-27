import { fetchForecast } from "@/api/weatherApi";
import { weatherKeys } from "@/constants/queryKey";
import { TemperatureUnit } from "@/types/common/unit";
import { useQuery } from "@tanstack/react-query";

export const useForecast = (
  lat?: string,
  lon?: string,
  unit?: TemperatureUnit
) => {
  return useQuery({
    queryKey: weatherKeys.forecast(lat ?? "", lon ?? "", unit ?? ""),
    queryFn: () => fetchForecast(lat!, lon!, unit!),
    enabled: !!lat && !!lon && !!unit,
  });
};
