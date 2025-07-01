import { useQueries } from "@tanstack/react-query";
import {
  fetchAstronomy,
  fetchCurrentWeather,
  fetchForecast,
} from "@/api/weatherApi";
import { Place } from "@/types/weather/place";
import { TemperatureUnit } from "@/types/common/unit";
import { LanguageCode } from "@/types/common/language";
import { weatherKeys } from "@/constants/queryKey";

export const useFullWeatherData = (
  places: Place[],
  currentLanguage: LanguageCode,
  unit: TemperatureUnit = "metric"
) => {
  const currentWeatherQueries = useQueries({
    queries: places.map((place) => ({
      queryKey: weatherKeys.current(place.lat, place.lon, currentLanguage),
      queryFn: () => fetchCurrentWeather(place.lat, place.lon, currentLanguage),
      enabled: !!place.lat && !!place.lon && !!currentLanguage,
    })),
  });

  const forecastQueries = useQueries({
    queries: places.map((place) => ({
      queryKey: weatherKeys.forecast(place.lat, place.lon, unit),
      queryFn: () => fetchForecast(place.lat, place.lon, unit),
      enabled: !!place.lat && !!place.lon && !!unit,
    })),
  });

  const astronomyQueries = useQueries({
    queries: places.map((place) => ({
      queryKey: weatherKeys.astronomy(place.lat, place.lon),
      queryFn: () => fetchAstronomy(place.lat, place.lon),
      enabled: !!place.lat && !!place.lon,
    })),
  });

  const isSuccess =
    currentWeatherQueries.every((q) => q.isSuccess) &&
    forecastQueries.every((q) => q.isSuccess) &&
    astronomyQueries.every((q) => q.isSuccess);

  const isLoading =
    currentWeatherQueries.some((q) => q.isFetching) ||
    forecastQueries.some((q) => q.isFetching) ||
    astronomyQueries.some((q) => q.isFetching);

  const isError =
    currentWeatherQueries.some((q) => q.isError) ||
    forecastQueries.some((q) => q.isError) ||
    astronomyQueries.some((q) => q.isError);

  return {
    currentWeatherQueries,
    forecastQueries,
    astronomyQueries,
    isSuccess,
    isLoading,
    isError,
  };
};
