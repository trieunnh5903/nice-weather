import { weatherApi } from "@/api/weatherApi";
import { Place, Sunrise, Weather } from "@/type";
import placeUtils from "@/utils/placeUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { flow, makeAutoObservable } from "mobx";
import { makePersistable, isHydrated } from "mobx-persist-store";
class WeatherStore {
  // allPlaceIds: string[] = [];
  // currentWeather: { [placeId: string]: CurrentWeather } = {};
  // forecasts: { [placeId: string]: Forecast } = {};
  places: { [id: string]: Place } = {};
  weather: { [id: string]: Weather } = {};
  allPlaceIds: string[] = [];
  sunrise: { [id: string]: Sunrise } = {};
  selectedIndex: number = -1;

  loaded: boolean = false;
  errorMsg: string | null = null;
  state: "idle" | "loading" | "error" = "idle";
  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "weatherStore",
      properties: [
        "places",
        "weather",
        "allPlaceIds",
        "sunrise",
        "selectedIndex",
      ],
      storage: AsyncStorage,
      stringify: true,
    });
  }

  get isHydrated() {
    return isHydrated(this);
  }

  // setCurrentWeather(currentWeather: { [provinceId: string]: CurrentWeather }) {
  //   this.currentWeather = currentWeather;
  // }

  // setWeather(weather: { [placeId: string]: Weather }) {
  //   this.weather = weather;
  // }

  // setLoaded(value: boolean) {
  //   this.loaded = value;
  // }

  setSelectedIndex(index: number) {
    this.selectedIndex = index;
  }

  // setForecasts(forecast: { [provinceId: string]: Forecast }) {
  //   this.forecasts = forecast;
  // }

  // setProvinces(provinces: { [id: string]: Province }) {
  //   this.provinces = provinces;
  // }

  // setAllProvinceIds(provinceIds: string[]) {
  //   this.allProvinceIds = provinceIds;
  // }

  setState(state: "idle" | "loading" | "error") {
    this.state = state;
  }

  // get allProvinces() {
  //   return this.allProvinceIds.map((id) => {
  //     return {
  //       province: this.provinces[id],
  //       currentWeather: this.currentWeather[id],
  //     };
  //   });
  // }

  // get selectedForcastDaily() {
  //   const currentTimestamp = Math.floor(Date.now() / 1000);
  //   const list = this.forecasts[this.selectedProvinceId].list;
  //   const closestPastItem = list.reduce((pre, curr) => {
  //     return curr.dt < currentTimestamp && curr.dt > pre.dt ? curr : pre;
  //   }, list[0]);

  //   const closestPastDay = new Date(closestPastItem.dt * 1000);
  //   const endOfNextDay = new Date(closestPastDay);
  //   endOfNextDay.setDate(closestPastDay.getDate() + 1);
  //   const endOfNextDayTimestamp = Math.floor(endOfNextDay.getTime() / 1000);
  //   const filteredItems = list.filter(
  //     (item) =>
  //       item.dt >= closestPastItem.dt && item.dt <= endOfNextDayTimestamp
  //   );
  //   return [closestPastItem, ...filteredItems];
  // }

  // get selectedProvince() {
  //   return this.provinces[this.selectedProvinceId];
  // }

  get selectedPlaceId() {
    return this.allPlaceIds[this.selectedIndex];
  }

  get selectedSunrise() {
    return this.sunrise[this.selectedPlaceId];
  }

  get selectedWeather() {
    return this.weather[this.selectedPlaceId];
  }

  get selectedCurrenWeather() {
    return this.weather[this.selectedPlaceId].current;
  }

  get selectedPlace() {
    return this.places[this.selectedPlaceId];
  }

  get allPlace() {
    return this.allPlaceIds.map((id) => {
      return {
        place: this.places[id],
        currentWeather: this.weather[id].current,
      };
    });
  }

  addPlace = flow(function* (this: WeatherStore, place: Place) {
    try {
      this.state = "loading";

      const [weather, sunrise] = yield Promise.all([
        weatherApi.fetchWeather(place.lat, place.lon),
        weatherApi.fetchSunrise(place.lat, place.lon),
      ]);

      if (!weather) {
        this.errorMsg = "weather null";
        return;
      }

      if (!place) {
        this.errorMsg = "place null";
        return;
      }

      if (!sunrise) {
        this.errorMsg = "sunrise null";
        return;
      }

      if (!this.allPlaceIds.includes(place.place_id)) {
        this.places[place.place_id] = place;
        this.allPlaceIds.push(place.place_id);
        this.selectedIndex = this.allPlaceIds.length - 1;
        // this.setSelectedIndex(this.allPlaceIds.length - 1);
      } else {
        this.selectedIndex = this.allPlaceIds.indexOf(place.place_id);

        // this.setSelectedIndex(this.allPlaceIds.indexOf(placeId));
      }
      this.sunrise[place.place_id] = sunrise;
      this.weather[place.place_id] = weather;
      this.state = "idle";
      this.errorMsg = null;
    } catch (error: any) {
      console.error("Failed to fetch data", error.message);
      this.state = "error";
      this.errorMsg = `Error fetching weather data. ${error.message}`;
    }
  });

  updateSelectedPlace(direction: "increase" | "decrease") {
    const length = this.allPlaceIds.length;
    if (direction === "increase") {
      this.selectedIndex =
        this.selectedIndex === length - 1 ? 0 : this.selectedIndex + 1;
      // this.setSelectedIndex(
      //   this.selectedIndex === length - 1 ? 0 : this.selectedIndex + 1
      // );
    } else {
      this.selectedIndex =
        this.selectedIndex === 0 ? length - 1 : this.selectedIndex - 1;
      // this.setSelectedIndex(
      //   this.selectedIndex === 0 ? length - 1 : this.selectedIndex - 1
      // );
    }
  }

  deletePlace(placeId: string) {
    //   if (!(placeId in this.places)) return;
    //   delete this.places[placeId];
    //   delete this.weather[placeId];
    //   delete this.forecasts[placeId];
    //   this.setAllProvinceIds(this.allProvinceIds.filter((i) => i !== provinceId));
    //   this.setSelectedIndex(
    //     Math.min(this.selectedIndex, this.allProvinceIds.length - 1)
    //   );
    //   return this.allProvinceIds.length;
  }

  deleteMany(placeIds: string[]) {
    //   provinceIds.forEach((provinceId) => {
    //     delete this.provinces[provinceId];
    //     delete this.currentWeather[provinceId];
    //     delete this.forecasts[provinceId];
    //   });
    //   this.setAllProvinceIds(
    //     this.allProvinceIds.filter((id) => !provinceIds.includes(id))
    //   );
    //   this.setSelectedIndex(
    //     Math.min(this.selectedIndex, this.allProvinceIds.length - 1)
    //   );
    //   return this.allProvinceIds.length;
  }

  deleteAll() {
    this.places = {};
    this.weather = {};
    this.allPlaceIds = [];
    this.selectedIndex = -1;
    this.sunrise = {};
  }
}

export default WeatherStore;
