import axios from "axios";

export const axiosWeatherInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_WEATHER_API_URL_KEY,
});

export const axiosMeteoInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_METEOSOURCE_URL_KEY,
});

export const axiosAstronomyInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_ASTRONOMY_URL_KEY,
});
