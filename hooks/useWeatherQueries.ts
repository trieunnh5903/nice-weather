import { useCurrentWeather } from "./useCurrentWeather";
import { useForecast } from "./useForecast";
import { useSunriseSunset } from "./useSunriseSunset";
import { TemperatureUnit } from "@/types/common/unit";
import { LanguageCode } from "@/types/common/language";

interface UseWeatherQueriesInput {
  lat: string;
  lon: string;
  unit: TemperatureUnit;
  language: LanguageCode;
}

export const useWeatherQueries = ({
  lat,
  lon,
  unit,
  language,
}: UseWeatherQueriesInput) => {
  const current = useCurrentWeather(lat, lon, language);
  const forecast = useForecast(lat, lon, unit);
  const astronomy = useSunriseSunset(lat, lon);

  const isSuccess =
    current.isSuccess && forecast.isSuccess && astronomy.isSuccess;
  const isLoading =
    current.isLoading || forecast.isLoading || astronomy.isLoading;

  return {
    current,
    forecast,
    astronomy,
    isSuccess,
    isLoading,
  };
};
