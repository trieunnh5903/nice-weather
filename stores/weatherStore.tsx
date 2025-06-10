import { TemperatureUnit } from "@/types/common/unit";
import { Place } from "@/types/weather/place";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeAutoObservable } from "mobx";
import { makePersistable, isHydrated } from "mobx-persist-store";
import { ColorSchemeName } from "react-native";
class WeatherStore {
  theme: ColorSchemeName = null;
  stateTime: number = 3600;
  places: Place[] = [];
  selectedIndex: number = -1;
  temperatureUnit: TemperatureUnit = "metric";
  loaded: boolean = false;
  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "weatherStore",
      properties: [
        "places",
        "stateTime",
        "temperatureUnit",
        "theme",
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

  setPlaces(places: Place[]) {
    this.places = places;
  }

  get selectedPlace() {
    return this.places[this.selectedIndex];
  }

  changeTemperatureUnit(unit: TemperatureUnit) {
    this.temperatureUnit = unit;
  }

  changeStaleTime(staleTime: number) {
    this.stateTime = staleTime;
  }

  addPlace(place: Place) {
    if (!place) {
      return;
    }

    const index = this.places.findIndex(
      (item) => item.place_id === place.place_id
    );
    if (index < 0) {
      this.places.push(place);
      this.selectedIndex = this.places.length - 1;
    } else {
      this.selectedIndex = index;
    }
  }

  changeTheme(newTheme: ColorSchemeName) {
    this.theme = newTheme;
  }

  deletePlace(placeId: string) {
    this.places = this.places.filter((i) => i.place_id !== placeId);
    this.setSelectedIndex(Math.min(this.selectedIndex, this.places.length - 1));
  }

  deleteMany(placeIds: string[]) {
    this.places = this.places.filter(
      (place) => !placeIds.includes(place.place_id)
    );
    this.setSelectedIndex(Math.min(this.selectedIndex, this.places.length - 1));
    return this.places.length;
  }

  deleteAll() {
    this.places = [];
    this.selectedIndex = -1;
  }
}

export default WeatherStore;
