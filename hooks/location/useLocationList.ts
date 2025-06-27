import { useCallback } from "react";
import { useStores, useLanguage } from "@/hooks/common";
import { useFullWeatherData } from "@/hooks/weather";
import { weatherUtils } from "@/utils";

export function useLocationList() {
  const { weatherStore } = useStores();
  const { currentLanguage } = useLanguage();
  const { currentWeatherQueries } = useFullWeatherData(
    weatherStore.places,
    currentLanguage
  );

  const getTemperature = useCallback(
    (index: number): string | undefined => {
      const current = currentWeatherQueries[index].data?.current;
      if (!current) return;

      return weatherStore.temperatureUnit === "metric"
        ? weatherUtils.formatCelsius(current.temp_c)
        : weatherUtils.formatFahrenheit(current.temp_f);
    },
    [currentWeatherQueries, weatherStore.temperatureUnit]
  );

  return {
    places: weatherStore.places,
    getTemperature,
    setSelectedIndex: weatherStore.setSelectedIndex,
  };
}
