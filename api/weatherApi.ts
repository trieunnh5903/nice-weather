import { Location, Weather } from "@/type";
import axios, { AxiosResponse } from "axios";

// // Tạo một instance riêng cho API thời tiết
// const weatherApi = axios.create({
//   baseURL: process.env.EXPO_PUBLIC_OPEN_WEATHER_URL_KEY, // URL của API
// });

// const onResponse = (
//   response: AxiosResponse<LocationWeather>
// ): AxiosResponse<LocationWeather> => {
//   if (response.data) {
//     const data = response.data;
//   }
//   return response;
// };
// // Thêm interceptor cho response để chuyển đổi nhiệt độ từ Kelvin sang Celsius
// weatherApi.interceptors.response.use(onResponse, (error) => {
//   return Promise.reject(error);
// });

// export default weatherApi;

const reverseGeocoding = async (lat: number, long: number) => {
  try {
    const response = await axios.get<Location[]>(
      `/geo/1.0/reverse?lat=${lat}&lon=${long}&limit=1&appid=${process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY}`
    );
    return response.data[0];
  } catch (error) {
    console.log("reverseGeocoding", error);
  }
};

// function* fetchCurrentWeather(lat: number, lon: number) {
//   try {
//     const response = yield axios.get<Weather>(
//       `/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY}&units=metric`
//     );
//     return response.data;
//   } catch (error) {
//     console.log("fetchCurrentWeather", error);
//   }
// }

export const weatherApi = { reverseGeocoding };
