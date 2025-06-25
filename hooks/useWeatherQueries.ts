import { useCurrentWeather } from "./useCurrentWeather";
import { Place } from "@/types/weather/place";
import { useForecast } from "./useForecast";
import { useSunriseSunset } from "./useSunriseSunset";
import { TemperatureUnit } from "@/types/common/unit";

export const useWeatherQueries = (
  params: Partial<Pick<Place, "lat" | "lon">> & {
    unit: TemperatureUnit;
  }
) => {
  const q1 = useCurrentWeather(params.lat, params.lon);
  const q2 = useForecast(params.lat, params.lon, params.unit);
  const q3 = useSunriseSunset(params.lat, params.lon);
  return {
    isSuccess: q1.isSuccess && q2.isSuccess && q3.isSuccess,
    isLoading: q1.isLoading || q2.isLoading || q3.isLoading,
  };
};
