import { useLanguage, useStores } from "../common";
import { useCurrentWeather } from "./useCurrentWeather";

export const useSelectedPlaceWeather = () => {
  const { weatherStore } = useStores();
  const { currentLanguage } = useLanguage();

  const currentWeatherQuery = useCurrentWeather(
    weatherStore.selectedPlace.lat,
    weatherStore.selectedPlace.lon,
    currentLanguage
  );

  return {
    selectedPlace: weatherStore.selectedPlace,
    selectedIndex: weatherStore.selectedIndex,
    totalPlace: weatherStore.places.length,
    currentWeather: currentWeatherQuery.data,
    isSuccess: currentWeatherQuery.isSuccess,
  };
};
