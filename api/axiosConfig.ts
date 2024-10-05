import axios from "axios";

export const axiosWeatherInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_WEATHER_URL_KEY,
});

export const axiosSunriseInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_SUNRISE_URL_KEY,
  // timeout: 5000,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});
