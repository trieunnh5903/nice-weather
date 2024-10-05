import { AxiosResponse } from "axios";
import { axiosSunriseInstance, axiosWeatherInstance } from "./axiosConfig";

const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

async function fetchData(endpoint: string, params = {}) {
  console.log(apiKey);

  try {
    const response: AxiosResponse = await axiosWeatherInstance.get(endpoint, {
      params: { ...params, key: apiKey },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

const reverseGeocoding = async (lat: string, lon: string) => {
  try {
    return await fetchData("/api/v1/free/nearest_place", { lat, lon });
  } catch (error) {
    console.log("reverseGeocoding", error);
    return null;
  }
};

const directGeocoding = async (text: string) => {
  try {
    return await fetchData("/api/v1/free/find_places_prefix", { text });
  } catch (error) {
    console.log("directGeocoding", error);
    return null;
  }
};

const fetchWeather = async (lat: string, lon: string) => {
  try {
    return await fetchData(
      // `/point?lat=${lat}&lon=${lon}&sections=all&language=en&units=metric`
      "/api/v1/free/point",
      { lat, lon, sections: "all", language: "en", units: "metric" }
    );
  } catch (error) {
    console.log("fetchWeather", error);
    return null;
  }
};

const fetchSunrise = async (lat: string, lng: string) => {
  try {
    const response = await axiosSunriseInstance.get(
      // `json?lat=${lat}&lng=${lon}&date_start=today&date_end=tomorrow`
      "/json",
      { params: { lat, lng, date_start: "today", date_end: "tomorrow" } }
    );
    return response.data;
  } catch (error) {
    console.log("fetchSunrise Error", error);
    return null;
  }
};

export const weatherApi = {
  fetchSunrise,
  reverseGeocoding,
  directGeocoding,
  fetchWeather,
};
