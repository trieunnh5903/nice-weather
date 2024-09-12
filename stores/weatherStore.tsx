import { weatherApi } from "@/api/weatherApi";
import { CurrentWeather, Location, Weather } from "@/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { flow, makeAutoObservable } from "mobx";

class WeatherStore {
  currentWeather: CurrentWeather[] = [];
  errorMsg: string | null = null;
  state: "idle" | "error" | "pending" = "idle";
  constructor() {
    makeAutoObservable(this);
  }

  setCurrentWeather(currentWeather: CurrentWeather[]) {
    this.currentWeather = currentWeather;
  }

  addCurrentWeather = flow(function* (this: WeatherStore, location: Location) {
    try {
      this.state = "pending";
      const index = this.currentWeather.findIndex((item) => {
        return JSON.stringify(location) === JSON.stringify(item.location);
      });

      if (index !== -1) {
        return;
      }
      const response: AxiosResponse<Weather> = yield axios.get(
        `/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY}&units=metric`
      );

      this.currentWeather.push({ ...response.data, location });
      this.errorMsg = null;
      this.saveCurrentWeather();
    } catch (error: any) {
      console.error("Failed to fetch data", error.message);
      this.state = "error";
    } finally {
      this.state = "idle";
    }
  });

  async saveCurrentWeather() {
    try {
      const jsonWeather = JSON.stringify(this.currentWeather);
      await AsyncStorage.setItem("currentWeather", jsonWeather);
    } catch (error) {
      console.log("Error saving todos: ", error);
    }
  }

  async loadCurrentWeather() {
    try {
      const jsonWeather = await AsyncStorage.getItem("currentWeather");
      if (jsonWeather) {
        this.setCurrentWeather(JSON.parse(jsonWeather));
      }
    } catch (error) {
      console.log("Error loading todos: ", error);
    }
  }
}

const weatherStore = new WeatherStore();
export default weatherStore;
