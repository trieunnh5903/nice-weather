import { weatherApi } from "@/api/weatherApi";
import { LanguageCode } from "@/constants/Languages";
import { QUERY_KEY } from "@/constants/QueryKey";
import { TemperatureUnit } from "@/type";
import { queryOptions } from "@tanstack/react-query";

function currentWeatherQueryOptions(
  lat: string,
  lon: string,
  language: LanguageCode
) {
  return queryOptions({
    queryKey: [QUERY_KEY.CURRENT_WEATHER, lat, lon, language],
    queryFn: () => weatherApi.fetchCurrentWeather(lat, lon, language),
    enabled: !!lat && !!lon && !!language,
  });
}

function forecastQueryOptions(
  lat: string,
  lon: string,
  units: TemperatureUnit
) {
  return queryOptions({
    queryKey: [QUERY_KEY.FORECAST, lat, lon, units],
    queryFn: () => weatherApi.fetchForecast(lat, lon, units),
    enabled: !!lat && !!lon && !!units,
  });
}

function astronomyQueryOptions(lat: string, lon: string) {
  return queryOptions({
    queryKey: [QUERY_KEY.ASTRONOMY, lat, lon],
    queryFn: () => weatherApi.fetchAstronomy(lat, lon),
    enabled: !!lat && !!lon,
  });
}

export const queryConfig = {
  astronomyQueryOptions,
  forecastQueryOptions,
  currentWeatherQueryOptions,
};
