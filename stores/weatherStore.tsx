import { weatherApi } from "@/api/weatherApi";
import { CurrentWeather, Forecast, Province } from "@/type";
import provinceUtils from "@/utils/provinceUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { flow, makeAutoObservable } from "mobx";
import { makePersistable, isHydrated } from "mobx-persist-store";
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
    makePersistable(this, {
      name: "weatherStore",
      properties: [
        "provinces",
        "allProvinceIds",
        "currentWeather",
        "forecasts",
        "selectedIndex",
      ],
      storage: AsyncStorage,
      stringify: true,
    });
  }

  get isHydrated() {
    return isHydrated(this);
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

  get selectedForcastDaily() {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const list = this.forecasts[this.selectedProvinceId].list;
    const closestPastItem = list.reduce((pre, curr) => {
      return curr.dt < currentTimestamp && curr.dt > pre.dt ? curr : pre;
    }, list[0]);

    const closestPastDay = new Date(closestPastItem.dt * 1000);
    const endOfNextDay = new Date(closestPastDay);
    endOfNextDay.setDate(closestPastDay.getDate() + 1);
    const endOfNextDayTimestamp = Math.floor(endOfNextDay.getTime() / 1000);
    const filteredItems = list.filter(
      (item) =>
        item.dt >= closestPastItem.dt && item.dt <= endOfNextDayTimestamp
    );
    return [closestPastItem, ...filteredItems];
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
      this.state = "idle";
      this.errorMsg = null;
    } catch (error: any) {
      console.error("Failed to fetch data", error.message);
      this.state = "error";
      this.errorMsg = `Error fetching weather data. ${error.message}`;
    }
  });

  updateSelectedProvince(direction: "increase" | "decrease") {
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
    return this.allProvinceIds.length;
  }

  deleteMany(provinceIds: string[]) {
    provinceIds.forEach((provinceId) => {
      delete this.provinces[provinceId];
      delete this.currentWeather[provinceId];
      delete this.forecasts[provinceId];
    });
    this.setAllProvinceIds(
      this.allProvinceIds.filter((id) => !provinceIds.includes(id))
    );
    this.setSelectedIndex(
      Math.min(this.selectedIndex, this.allProvinceIds.length - 1)
    );
    return this.allProvinceIds.length;
  }

  deleteAll() {
    this.setAllProvinceIds([]);
    this.setCurrentWeather({});
    this.setForecasts({});
    this.setProvinces({});
    this.setSelectedIndex(-1);
  }
}

export default WeatherStore;
