import { weatherApi } from "@/api/weatherApi";
import { Place, Sunrise, Weather } from "@/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { flow, makeAutoObservable } from "mobx";
import { makePersistable, isHydrated } from "mobx-persist-store";
class WeatherStore {
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

  setSelectedIndex(index: number) {
    this.selectedIndex = index;
  }

  setState(state: "idle" | "loading" | "error") {
    this.state = state;
  }

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
        weatherApi.fetchWeather(place.lat, place.lon, place.timezone),
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
      } else {
        this.selectedIndex = this.allPlaceIds.indexOf(place.place_id);
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
    } else {
      this.selectedIndex =
        this.selectedIndex === 0 ? length - 1 : this.selectedIndex - 1;
    }
  }

  deletePlace(placeId: string) {
    if (!(placeId in this.places)) return;
    delete this.places[placeId];
    delete this.weather[placeId];
    delete this.sunrise[placeId];
    this.allPlaceIds = this.allPlaceIds.filter((i) => i !== placeId);
    this.setSelectedIndex(
      Math.min(this.selectedIndex, this.allPlaceIds.length - 1)
    );
  }

  deleteMany(placeIds: string[]) {
    placeIds.forEach((placeId) => {
      delete this.weather[placeId];
      delete this.sunrise[placeId];
      delete this.places[placeId];
    });
    this.allPlaceIds = this.allPlaceIds.filter((id) => !placeIds.includes(id));
    this.setSelectedIndex(
      Math.min(this.selectedIndex, this.allPlaceIds.length - 1)
    );
    return this.allPlaceIds.length;
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
