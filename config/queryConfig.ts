import { weatherApi } from "@/api/weatherApi";
import { TemperatureUnit } from "@/type";
import { queryOptions } from "@tanstack/react-query";

function weatherQueryOptions(lat: string, lon: string, units: TemperatureUnit) {
  return queryOptions({
    queryKey: ["weather", lat, lon],
    queryFn: () => weatherApi.fetchWeatherData(lat, lon, units),
    enabled: !!lat && !!lon && !!units,
  });
}

export const queryConfig = { weatherQueryOptions };
