import { showError } from "@/utils/errorHandler";
import axios from "axios";

export const axiosWeatherInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_WEATHER_API_URL_KEY,
});

export const axiosMeteoInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_METEOSOURCE_URL_KEY,
});

export const axiosAstronomyInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_SUNRISESUNSET_URL_KEY,
});

axiosWeatherInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    showError(error);
    return Promise.reject(error);
  }
);

axiosMeteoInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    showError(error);
    return Promise.reject(error);
  }
);

axiosAstronomyInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    showError(error);
    return Promise.reject(error);
  }
);

