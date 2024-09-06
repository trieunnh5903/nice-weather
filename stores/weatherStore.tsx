import { LocationWeather } from "@/type";
import axios from "axios";
import { action, makeAutoObservable } from "mobx";

class WeatherStore {
  locations: LocationWeather[] = [];
  errorMsg: string | null = null;
  state = "pending";
  constructor() {
    makeAutoObservable(this);
  }

  weatherFetchSuccess = (weatherData: LocationWeather) => {
    this.locations.push(weatherData);
    this.state = "done";
    this.errorMsg = null;
  };

  weatherFetchFailure = (error: any) => {
    this.state = "error";
    this.errorMsg = error as string;
  };
  async addLocation(latitude: number, longitude: number) {
    try {
      // console.log("latitude", latitude);
      // console.log("longitude", longitude);
      this.state = "pending";
      const response = await axios.get<LocationWeather>(
        `${process.env.EXPO_PUBLIC_OPEN_WEATHER_URL_KEY}/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY}`
      );
      // console.log("response", response.data);
      const weatherData = response.data;
      this.weatherFetchSuccess(weatherData);
    } catch (error) {
      this.weatherFetchFailure(error);
    }
  }
}

const weatherStore = new WeatherStore();
export default weatherStore;
