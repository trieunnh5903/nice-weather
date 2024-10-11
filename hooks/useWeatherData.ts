import { queryOptions, useQueries } from "@tanstack/react-query";
import { useStores } from "./useStore";
import { weatherApi } from "@/api/weatherApi";

export function weatherQueryOptions(place_id: string) {
  return queryOptions({
    queryKey: ["weather", place_id],
    queryFn: () => weatherApi.fetchWeather(place_id),
    enabled: !!place_id,
  });
}

export const useWeatherSelected = () => {
  const { weatherStore } = useStores();
  const allWeather = useQueries({
    queries: weatherStore.places.map((place) => ({
      queryKey: ["weather", place.place_id],
      queryFn: () => weatherApi.fetchWeather(place.place_id),
    })),
  });
  return allWeather[weatherStore.selectedIndex].data;
};

export const useSunriseSelected = () => {
  const { weatherStore } = useStores();
  const allSunrise = useQueries({
    queries: weatherStore.places.map((place) => ({
      queryKey: ["sunrise", place.lat, place.lat],
      queryFn: () => weatherApi.fetchSunrise(place.lat, place.lon),
    })),
  });
  return allSunrise[weatherStore.selectedIndex].data?.results;
};
