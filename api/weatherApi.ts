import { AxiosInstance, AxiosResponse } from "axios";

import {
  axiosAstronomyInstance,
  axiosMeteoInstance,
  axiosWeatherInstance,
} from "./axiosConfig";
import { Place } from "@/types/weather/place";
import { AstronomyResponse } from "@/types/weather/astronomy";
import { CurrentWeatherResponse } from "@/types/weather/currenWeather";
import { TemperatureUnit } from "@/types/common/unit";
import { Forecast } from "@/types/weather/forecast";
import { LanguageCode } from "@/types/common/language";

const fetchData = async <T>(
  instance: AxiosInstance,
  apiKey: string | undefined,
  endpoint: string,
  params = {}
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await instance.get(endpoint, {
      params: { ...params, key: apiKey },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchDataMeteoApi = <T>(endpoint: string, params = {}) =>
  fetchData<T>(
    axiosMeteoInstance,
    process.env.EXPO_PUBLIC_METEOSOURCE_API_KEY,
    endpoint,
    params
  );

const fetchDataWeatherApi = <T>(endpoint: string, params = {}) =>
  fetchData<T>(
    axiosWeatherInstance,
    process.env.EXPO_PUBLIC_WEATHER_API_API_KEY,
    endpoint,
    params
  );

export const reverseGeocoding = async (lat: string, lon: string) => {
  try {
    return await fetchDataMeteoApi<Place>("/api/v1/free/nearest_place", {
      lat,
      lon,
    });
  } catch (error) {
    throw error;
  }
};

export const directGeocoding = async (text: string) => {
  try {
    return await fetchDataMeteoApi<Place[]>("/api/v1/free/find_places_prefix", {
      text,
    });
  } catch (error) {
    // console.log("directGeocoding", error);
    throw error;
  }
};

export const fetchAstronomy = async (lat: string, lon: string) => {
  try {
    const response = await axiosAstronomyInstance.get<AstronomyResponse>(
      "/json",
      {
        params: { lat, lng: lon, date_start: "today", date_end: "tomorrow" },
      }
    );
    return response.data;
  } catch (error) {
    // console.log("fetchAstronomy", error);
    throw error;
  }
};

export const fetchCurrentWeather = async (
  lat: string,
  lon: string,
  lang: LanguageCode
) => {
  return await fetchDataWeatherApi<CurrentWeatherResponse>("v1/current.json", {
    q: `${lat},${lon}`,
    aqi: "yes",
    lang,
  });
};

export const fetchForecast = async (
  lat: string,
  lon: string,
  units: TemperatureUnit
) => {
  return await fetchDataMeteoApi<Forecast>("/api/v1/free/point", {
    lat,
    lon,
    sections: "all",
    language: "en",
    units,
  });
};
