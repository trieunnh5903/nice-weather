import { weatherApi } from "@/api/weatherApi";
import { CurrentWeather, Location } from "@/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { flow, makeAutoObservable } from "mobx";

class WeatherStore {
  currentWeather: CurrentWeather[] = [];
  errorMsg: string | null = null;
  state: "idle" | "error" | "pending" = "idle";
  selectedWeather: number = 0;
  constructor() {
    makeAutoObservable(this);
  }

  setCurrentWeather(currentWeather: CurrentWeather[]) {
    this.currentWeather = currentWeather;
  }

  setSelectedWeather(index: number) {
    this.selectedWeather = index;
  }

  updateSelectedWeather(direction: "increase" | "decrease") {
    if (direction === "increase") {
      this.setSelectedWeather(
        Math.min(this.selectedWeather + 1, this.currentWeather.length - 1)
      );
    } else if (direction === "decrease") {
      this.setSelectedWeather(Math.max(this.selectedWeather - 1, 0));
    }
  }

  deleteCurrentWeather(location: Location) {
    const index = this.currentWeather.findIndex(
      (item) =>
        item.location.lat === location.lat && item.location.lon === location.lon
    );
    if (index !== -1) {
      const updatedCurrWeather = this.currentWeather.filter(
        (_, i) => i !== index
      );
      this.setCurrentWeather(updatedCurrWeather);
      this.setSelectedWeather(Math.min(index, updatedCurrWeather.length - 1));
      this.saveCurrentWeather();
    }
  }

  addCurrentWeather = flow(function* (this: WeatherStore, location: Location) {
    try {
      this.state = "pending";
      const exists = this.currentWeather.some(
        (item) =>
          item.location.lat === location.lat &&
          item.location.lon === location.lon
      );
      if (exists) return;

      const data = yield weatherApi.fetchCurrentWeather(
        location.lat,
        location.lon
      );
      this.currentWeather.push({ ...data, location });
      this.setSelectedWeather(this.currentWeather.length - 1);
      this.errorMsg = null;
      this.saveCurrentWeather();
    } catch (error: any) {
      console.error("Failed to fetch data", error.message);
      this.state = "error";
      this.errorMsg = "Error fetching weather data.";
    } finally {
      this.state = "idle";
    }
  });

  async saveCurrentWeather() {
    try {
      const jsonWeather = JSON.stringify(this.currentWeather);
      const jsonSelected = JSON.stringify(this.selectedWeather);
      await AsyncStorage.multiSet([
        ["currentWeather", jsonWeather],
        ["selectedWeather", jsonSelected],
      ]);
    } catch (error) {
      console.log("Error saving todos: ", error);
    }
  }

  async loadCurrentWeather() {
    try {
      const [jsonWeather, jsonSelected] = await AsyncStorage.multiGet([
        "currentWeather",
        "selectedWeather",
      ]);

      if (jsonWeather[1]) {
        this.setCurrentWeather(JSON.parse(jsonWeather[1]));
      }

      if (jsonSelected[1]) {
        this.setSelectedWeather(JSON.parse(jsonSelected[1]));
      }
    } catch (error) {
      console.log("Error loading todos: ", error);
    }
  }
}

const weatherStore = new WeatherStore();
export default weatherStore;
