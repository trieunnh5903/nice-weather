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
    return this.places[this.selectedIndex] ?? null;
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
    const indexToDelete = this.places.findIndex((i) => i.place_id === placeId);
    if (indexToDelete === -1) return;

    this.places = this.places.filter((i) => i.place_id !== placeId);

    if (this.places.length === 0) {
      this.setSelectedIndex(-1);
    } else if (this.selectedIndex === indexToDelete) {
      this.setSelectedIndex(0);
    } else if (this.selectedIndex > indexToDelete) {
      this.setSelectedIndex(this.selectedIndex - 1);
    }
  }

  deleteMany(placeIds: string[]) {
    const deletedIndexes = this.places
      .map((p, idx) => (placeIds.includes(p.place_id) ? idx : -1))
      .filter((i) => i !== -1);

    const wasSelectedDeleted = deletedIndexes.includes(this.selectedIndex);

    this.places = this.places.filter(
      (place) => !placeIds.includes(place.place_id)
    );

    if (wasSelectedDeleted) {
      this.setSelectedIndex(this.places.length > 0 ? 0 : -1);
    } else {
      const numDeletedBefore = deletedIndexes.filter(
        (idx) => idx < this.selectedIndex
      ).length;
      this.setSelectedIndex(this.selectedIndex - numDeletedBefore);
    }

    return this.places.length;
  }
  deleteAll() {
    this.places = [];
    this.selectedIndex = -1;
  }
}

export default WeatherStore;
