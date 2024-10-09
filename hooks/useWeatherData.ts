import { queryOptions, useQuery } from "@tanstack/react-query";
import { useStores } from "./useStore";
import { weatherApi } from "@/api/weatherApi";
import { Weather } from "@/type";

export function weatherQueryOptions(place_id: string) {
  return queryOptions({
    queryKey: ["weather", place_id],
    queryFn: () => weatherApi.fetchWeather(place_id),
    enabled: !!place_id,
  });
}

export const useWeatherSelected = <T = Weather>(
  select?: (data: Weather) => T
) => {
  const { weatherStore } = useStores();
  const place = weatherStore.selectedPlace;
  return useQuery({
    ...weatherQueryOptions(place.place_id),
    select,
  });
};

export const useCurrentWeatherSelected = () => {
  return useWeatherSelected((data) => data.current);
};

export const useDailyWeatherSelected = () => {
  return useWeatherSelected((data) => data.daily.data);
};

export const useHourlyWeatherSelected = () => {
  return useWeatherSelected((data) => data.hourly.data);
};

export const useSunriseSelected = () => {
  const { weatherStore } = useStores();
  const place = weatherStore.selectedPlace;
  return useQuery({
    queryKey: ["sunrise", place.lat, place.lat],
    queryFn: () => weatherApi.fetchSunrise(place.lat, place.lon),
    select(data) {
      return data.results;
    },
  });
};
