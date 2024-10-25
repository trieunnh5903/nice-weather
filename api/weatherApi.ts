import { AxiosResponse } from "axios";

import {
  Astronomy,
  CurrentWeather,
  Forecast,
  Place,
  TemperatureUnit,
} from "@/type";
import {
  axiosAstronomyInstance,
  axiosMeteoInstance,
  axiosWeatherInstance,
} from "./axiosConfig";
import { LanguageCode } from "@/constants/languages";
export interface CurrentWeatherResponse {
  current: CurrentWeather;
}

export interface AstronomyResponse {
  results: Astronomy[];
  status: string;
}

async function fetchDataMeteoApi<T>(endpoint: string, params = {}) {
  try {
    console.log(endpoint);
    const response: AxiosResponse<T> = await axiosMeteoInstance.get(endpoint, {
      params: { ...params, key: process.env.EXPO_PUBLIC_METEOSOURCE_API_KEY },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function fetchDataWeatherApi<T>(endpoint: string, params = {}) {
  try {
    console.log(endpoint);
    const response: AxiosResponse<T> = await axiosWeatherInstance.get(
      endpoint,
      {
        params: { ...params, key: process.env.EXPO_PUBLIC_WEATHER_API_API_KEY },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

const reverseGeocoding = async (lat: string, lon: string) => {
  try {
    return await fetchDataMeteoApi<Place>("/api/v1/free/nearest_place", {
      lat,
      lon,
    });
  } catch (error) {
    console.log("reverseGeocoding", error);
    return null;
  }
};

const directGeocoding = async (text: string) => {
  try {
    return await fetchDataMeteoApi<Place[]>("/api/v1/free/find_places_prefix", {
      text,
    });
  } catch (error) {
    console.log("directGeocoding", error);
    return;
  }
};

const fetchAstronomy = async (lat: string, lon: string) => {
  console.log("fetchAstronomy");

  try {
    const response = await axiosAstronomyInstance.get<AstronomyResponse>(
      "/json",
      {
        params: { lat, lng: lon, date_start: "today", date_end: "tomorrow" },
      }
    );
    return response.data;
  } catch (error) {
    console.log("fetchAstronomy", error);
    throw error;
  }
};

const fetchCurrentWeather = async (
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

const fetchForecast = async (
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

export const weatherApi = {
  reverseGeocoding,
  directGeocoding,
  fetchAstronomy,
  fetchCurrentWeather,
  fetchForecast,
};
