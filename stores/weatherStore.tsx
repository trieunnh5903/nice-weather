import { LocationWeather } from "@/type";
import axios from "axios";
import { makeAutoObservable } from "mobx";

class WeatherStore {
  locations: LocationWeather[] = [];
  errorMsg: string | null = null;
  state: "idle" | "error" | "pending" = "idle";
  constructor() {
    makeAutoObservable(this);
  }

  weatherFetchSuccess = (weatherData: LocationWeather) => {
    this.locations.push(weatherData);
    this.state = "idle";
    this.errorMsg = null;
  };

  weatherFetchFailure = (error: any) => {
    this.state = "error";
    this.errorMsg = error as string;
  };
  async addLocation(latitude: number, longitude: number) {
    try {
      this.state = "pending";
      const response = await axios.get<LocationWeather>(
        `${process.env.EXPO_PUBLIC_OPEN_WEATHER_URL_KEY}/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY}&units=metric`
      );
      const weatherData = response.data;
      this.weatherFetchSuccess(weatherData);
    } catch (error) {
      this.weatherFetchFailure(error);
    }
  }
}

const weatherStore = new WeatherStore();
export default weatherStore;
