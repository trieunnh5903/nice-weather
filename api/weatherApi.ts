import { AxiosResponse } from "axios";
import { axiosSunriseInstance, axiosWeatherInstance } from "./axiosConfig";
import { Place, Sunrise, TemperatureUnit, Weather } from "@/type";

const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

async function fetchData<T>(endpoint: string, params = {}) {
  try {
    console.log(endpoint);
    const response: AxiosResponse<T> = await axiosWeatherInstance.get(
      endpoint,
      {
        params: { ...params, key: apiKey },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

const reverseGeocoding = async (lat: string, lon: string) => {
  try {
    return await fetchData<Place>("/api/v1/free/nearest_place", { lat, lon });
  } catch (error) {
    console.log("reverseGeocoding", error);
    return null;
  }
};

const directGeocoding = async (text: string) => {
  try {
    return await fetchData<Place[]>("/api/v1/free/find_places_prefix", {
      text,
    });
  } catch (error) {
    console.log("directGeocoding", error);
    return;
  }
};

const fetchWeather = async (placeId: string, unit: TemperatureUnit) => {
  try {
    return await fetchData<Weather>("/api/v1/free/point", {
      place_id: placeId,
      sections: "all",
      language: "en",
      units: unit,
    });
  } catch (error) {
    console.log("fetchWeather", error);
    throw error;
  }
};

const fetchSunrise = async (lat: string, lng: string) => {
  try {
    console.log("fetchSunrise");
    const response = await axiosSunriseInstance.get<Sunrise>("/json", {
      params: { lat, lng, date_start: "today", date_end: "tomorrow" },
    });
    return response.data;
  } catch (error) {
    console.log("fetchSunrise Error", error);
    throw error;
  }
};

export const weatherApi = {
  fetchSunrise,
  reverseGeocoding,
  directGeocoding,
  fetchWeather,
};
