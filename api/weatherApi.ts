import axios, { AxiosResponse } from "axios";

const apiKey = process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY;

async function fetchData(endpoint: string, params = {}) {
  try {
    const response: AxiosResponse = await axios.get(endpoint, {
      params: { ...params, appid: apiKey, units: "metric" },
    });
    return response.data;
  } catch (error) {
    console.log("API Error", error);
    return null;
  }
}

const reverseGeocoding = (lat: number, lon: number) =>
  fetchData("/geo/1.0/reverse", { lat, lon, limit: 1 });

const fetchCurrentWeather = (lat: number, lon: number) =>
  fetchData("/data/2.5/weather", { lat, lon });

const fetchForecast = (lat: number, lon: number) =>
  fetchData("/data/2.5/forecast", { lat, lon });

export const weatherApi = {
  reverseGeocoding,
  fetchForecast,
  fetchCurrentWeather,
};
