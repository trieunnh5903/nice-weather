import { queryConfig } from "@/config/queryConfig";
import { LanguageCode } from "@/constants/languages";
import { Place } from "@/types/type";
import { useQueries } from "@tanstack/react-query";

export const useWeatherQueries = (
  places: Place[],
  currentLanguage: LanguageCode
) => {
  const allCurrentWeather = useQueries({
    queries: places.map((place) =>
      queryConfig.currentWeatherQueryOptions(
        place.lat,
        place.lon,
        currentLanguage
      )
    ),
  });

  const allForecast = useQueries({
    queries: places.map((place) =>
      queryConfig.forecastQueryOptions(place.lat, place.lon, "metric")
    ),
  });

  const allAstronomy = useQueries({
    queries: places.map((place) =>
      queryConfig.astronomyQueryOptions(place.lat, place.lon)
    ),
  });

  const isSuccess =
    allCurrentWeather.some((q) => q.isSuccess) ||
    allForecast.some((q) => q.isSuccess) ||
    allAstronomy.some((q) => q.isSuccess);

  const isError =
    allCurrentWeather.some((q) => q.isError) ||
    allForecast.some((q) => q.isError) ||
    allAstronomy.some((q) => q.isError);

  return { allCurrentWeather, allForecast, allAstronomy, isSuccess, isError };
};
