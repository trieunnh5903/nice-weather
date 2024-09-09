import axios, { AxiosResponse } from "axios";
import { LocationWeather } from "@/type";

// Tạo một instance riêng cho API thời tiết
const weatherApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_OPEN_WEATHER_URL_KEY, // URL của API
});

const onResponse = (
  response: AxiosResponse<LocationWeather>
): AxiosResponse<LocationWeather> => {
  if (response.data) {
    const data = response.data;
  }
  return response;
};
// Thêm interceptor cho response để chuyển đổi nhiệt độ từ Kelvin sang Celsius
weatherApi.interceptors.response.use(onResponse, (error) => {
  return Promise.reject(error);
});

export default weatherApi;
