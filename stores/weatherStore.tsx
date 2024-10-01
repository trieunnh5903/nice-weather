import { weatherApi } from "@/api/weatherApi";
import { CurrentWeather, Forecast, Province } from "@/type";
import provinceUtils from "@/utils/provinceUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { flow, makeAutoObservable } from "mobx";
class WeatherStore {
  provinces: { [id: string]: Province } = {};
  allProvinceIds: string[] = [];
  currentWeather: { [provinceId: string]: CurrentWeather } = {};
  forecasts: { [provinceId: string]: Forecast } = {};
  selectedIndex: number = -1;

  lastSavedData: {
    provinces: string | null;
    allProvinceIds: string | null;
    currentWeather: string | null;
    forecasts: string | null;
    selectedProvince: string | null;
  } = {
    provinces: null,
    allProvinceIds: null,
    currentWeather: null,
    forecasts: null,
    selectedProvince: null,
  };

  loaded: boolean = false;
  errorMsg: string | null = null;
  state: "idle" | "loading" | "error" = "idle";
  constructor() {
    makeAutoObservable(this);
  }

  setCurrentWeather(currentWeather: { [provinceId: string]: CurrentWeather }) {
    this.currentWeather = currentWeather;
  }

  setLoaded(value: boolean) {
    this.loaded = value;
  }

  setSelectedIndex(index: number) {
    this.selectedIndex = index;
  }

  setForecasts(forecast: { [provinceId: string]: Forecast }) {
    this.forecasts = forecast;
  }

  setProvinces(provinces: { [id: string]: Province }) {
    this.provinces = provinces;
  }

  setAllProvinceIds(provinceIds: string[]) {
    this.allProvinceIds = provinceIds;
  }

  setState(state: "idle" | "loading" | "error") {
    this.state = state;
  }

  get allProvinces() {
    return this.allProvinceIds.map((id) => {
      return {
        province: this.provinces[id],
        currentWeather: this.currentWeather[id],
      };
    });
  }

  get selectedProvince() {
    return this.provinces[this.selectedProvinceId];
  }

  get selectedProvinceId() {
    return this.allProvinceIds[this.selectedIndex];
  }

  get selectedCurrentWeather() {
    return this.currentWeather[this.selectedProvinceId];
  }

  addProvince = flow(function* (this: WeatherStore, province: Province) {
    try {
      this.state = "loading";
      const provinceId = provinceUtils.getId(province);

      const [currentWeather, forecast] = yield Promise.all([
        weatherApi.fetchCurrentWeather(province.lat, province.lon),
        weatherApi.fetchForecast(province.lat, province.lon),
      ]);

      if (!this.allProvinceIds.includes(provinceId)) {
        this.provinces[provinceId] = province;
        this.allProvinceIds.push(provinceId);
        this.setSelectedIndex(this.allProvinceIds.length - 1);
      } else {
        this.setSelectedIndex(this.allProvinceIds.indexOf(provinceId));
      }

      this.currentWeather[provinceId] = currentWeather;
      this.forecasts[provinceId] = forecast;

      this.errorMsg = null;
      this.save();
    } catch (error: any) {
      console.error("Failed to fetch data", error.message);
      this.state = "error";
      this.errorMsg = `Error fetching weather data. ${error.message}`;
    } finally {
      this.state = "idle";
    }
  });

  async updateSelectedProvince(direction: "increase" | "decrease") {
    const length = this.allProvinceIds.length;
    if (direction === "increase") {
      this.setSelectedIndex(
        this.selectedIndex === length - 1 ? 0 : this.selectedIndex + 1
      );
    } else {
      this.setSelectedIndex(
        this.selectedIndex === 0 ? length - 1 : this.selectedIndex - 1
      );
    }
    this.save();
  }

  deleteProvince(provinceId: string) {
    if (!(provinceId in this.provinces)) return;
    delete this.provinces[provinceId];
    delete this.currentWeather[provinceId];
    delete this.forecasts[provinceId];
    this.setAllProvinceIds(this.allProvinceIds.filter((i) => i !== provinceId));
    this.setSelectedIndex(
      Math.min(this.selectedIndex, this.allProvinceIds.length - 1)
    );
    this.save();
    return this.allProvinceIds.length;
  }

  deleteMany(provinceIds: string[]) {
    provinceIds.forEach((provinceId) => this.deleteProvince(provinceId));
    return this.allProvinceIds.length;
  }

  deleteAll() {
    this.setAllProvinceIds([]);
    this.setCurrentWeather({});
    this.setForecasts({});
    this.setProvinces({});
    this.setSelectedIndex(-1);
    this.save();
  }

  async save() {
    try {
      if (this.allProvinceIds.length === 0) {
        await AsyncStorage.clear();
        return;
      }

      const data = {
        jsonWeather: JSON.stringify(this.currentWeather),
        jsonProvinces: JSON.stringify(this.provinces),
        jsonProvinceIds: JSON.stringify(this.allProvinceIds),
        jsonForecast: JSON.stringify(this.forecasts),
        jsonSelected: JSON.stringify(this.selectedIndex),
      };
      await AsyncStorage.multiSet(Object.entries(data));
    } catch (error) {
      console.log("Error saving data: ", error);
    }
  }

  async load() {
    try {
      const [
        jsonWeather,
        jsonProvinces,
        jsonProvinceIds,
        jsonForecast,
        jsonSelected,
      ] = await AsyncStorage.multiGet([
        "jsonWeather",
        "jsonProvinces",
        "jsonProvinceIds",
        "jsonForecast",
        "jsonSelected",
      ]);

      if (jsonWeather[1]) {
        this.setCurrentWeather(JSON.parse(jsonWeather[1]));
      }

      if (jsonProvinces[1]) {
        this.setProvinces(JSON.parse(jsonProvinces[1]));
      }

      if (jsonProvinceIds[1]) {
        this.setAllProvinceIds(JSON.parse(jsonProvinceIds[1]));
      }

      if (jsonForecast[1]) {
        this.setForecasts(JSON.parse(jsonForecast[1]));
      }

      if (jsonSelected[1]) {
        this.setSelectedIndex(JSON.parse(jsonSelected[1]));
      }
      this.setLoaded(true);
    } catch (error) {
      this.setLoaded(false);
      console.log("Error loading data: ", error);
    }
  }
}

export default WeatherStore;
