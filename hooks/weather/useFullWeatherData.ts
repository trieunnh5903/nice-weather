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
import { useMemo } from "react";

export const useFullWeatherData = (
  places: Place[],
  currentLanguage: LanguageCode,
  unit: TemperatureUnit = "metric"
) => {
  const currentWeatherQueries = useQueries({
    queries: useMemo(
      () =>
        places.map((place) => ({
          queryKey: weatherKeys.current(place.lat, place.lon, currentLanguage),
          queryFn: () =>
            fetchCurrentWeather(place.lat, place.lon, currentLanguage),
          enabled: !!place.lat && !!place.lon && !!currentLanguage,
        })),
      [places, currentLanguage]
    ),
  });

  const forecastQueries = useQueries({
    queries: useMemo(
      () =>
        places.map((place) => ({
          queryKey: weatherKeys.forecast(place.lat, place.lon, unit),
          queryFn: () => fetchForecast(place.lat, place.lon, unit),
          enabled: !!place.lat && !!place.lon && !!unit,
        })),
      [places, unit]
    ),
  });

  const astronomyQueries = useQueries({
    queries: useMemo(
      () =>
        places.map((place) => ({
          queryKey: weatherKeys.astronomy(place.lat, place.lon),
          queryFn: () => fetchAstronomy(place.lat, place.lon),
          enabled: !!place.lat && !!place.lon,
        })),
      [places]
    ),
  });

  const isSuccess =
    currentWeatherQueries.every((q) => q.isSuccess) &&
    forecastQueries.every((q) => q.isSuccess) &&
    astronomyQueries.every((q) => q.isSuccess);

  const isLoading =
    currentWeatherQueries.some((q) => q.isLoading) ||
    forecastQueries.some((q) => q.isLoading) ||
    astronomyQueries.some((q) => q.isLoading);

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
