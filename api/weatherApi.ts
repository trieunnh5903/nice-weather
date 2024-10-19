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
interface CurrentWeatherResponse {
  current: CurrentWeather;
}

interface AstronomyResponse {
  results: Astronomy[];
  status: "OK";
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
  console.log('fetchAstronomy');
  
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


const fetchWeatherData = async (
  lat: string,
  lon: string,
  units: TemperatureUnit
) => {
  const [current, forecast, astronomy] = await Promise.all([
    fetchDataWeatherApi<CurrentWeatherResponse>("v1/current.json", {
      q: `${lat},${lon}`,
      aqi: "yes",
    }),
    fetchDataMeteoApi<Forecast>("/api/v1/free/point", {
      lat,
      lon,
      sections: "all",
      language: "en",
      units,
    }),
    fetchAstronomy(lat, lon),
  ]);

  return {
    current: current.current,
    forecast: forecast,
    astronomy: astronomy.results,
  };
};

export const weatherApi = {
  reverseGeocoding,
  directGeocoding,
  fetchWeatherData,
};
