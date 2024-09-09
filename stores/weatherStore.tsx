import { LocationWeather } from "@/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";

class WeatherStore {
  locations: LocationWeather[] = [];
  errorMsg: string | null = null;
  state: "idle" | "error" | "pending" = "idle";
  constructor() {
    makeAutoObservable(this);
  }

  setLocations(locations: LocationWeather[]) {
    this.locations = locations;
  }

  weatherFetchSuccess = (weatherData: LocationWeather) => {
    this.locations.push(weatherData);
    this.state = "idle";
    this.errorMsg = null;
    this.saveLocations();
  };

  weatherFetchFailure = (error: any) => {
    this.state = "error";
    this.errorMsg = error as string;
  };

  async saveLocations() {
    try {
      const jsonWeather = JSON.stringify(this.locations);
      await AsyncStorage.setItem("locationWeather", jsonWeather);
    } catch (error) {
      console.log("Error saving todos: ", error);
    }
  }

  async loadLocations() {
    try {
      const jsonWeather = await AsyncStorage.getItem("locationWeather");
      if (jsonWeather) {
        this.setLocations(JSON.parse(jsonWeather));
      }
    } catch (error) {
      console.log("Error loading todos: ", error);
    }
  }

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
