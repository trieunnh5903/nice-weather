import { CurrentWeather, Forecast, Province } from "@/type";
import axios, { AxiosResponse } from "axios";

const reverseGeocoding = async (lat: number, long: number) => {
  try {
    const response = await axios.get<Province[]>(
      `/geo/1.0/reverse?lat=${lat}&lon=${long}&limit=1&appid=${process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY}`
    );
    return response.data[0];
  } catch (error) {
    console.log("reverseGeocoding", error);
  }
};

async function fetchCurrentWeather(lat: number, lon: number) {
  try {
    const response: AxiosResponse<CurrentWeather> = await axios.get(
      `/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY}&units=metric`
    );
    return response.data;
  } catch (error) {
    console.log("fetchCurrentWeather", error);
  }
}

async function fetchForecast(lat: number, lon: number) {
  try {
    const response: AxiosResponse<Forecast> = await axios.get(
      `/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY}&units=metric`
    );
    return response.data;
  } catch (error) {
    console.log("fetchForecast", error);
  }
}

export const weatherApi = {
  reverseGeocoding,
  fetchForecast,
  fetchCurrentWeather,
};
