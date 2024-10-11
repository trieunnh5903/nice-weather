import { Place } from "@/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeAutoObservable } from "mobx";
import { makePersistable, isHydrated } from "mobx-persist-store";
import { Appearance } from "react-native";
class WeatherStore {
  places: Place[] = [];
  selectedIndex: number = -1;
  isDarkMode = false;
  loaded: boolean = false;
  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "weatherStore",
      properties: ["places", "selectedIndex"],
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

  get selectedPlace() {
    return this.places[this.selectedIndex];
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

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }

  updateSelectedPlace(direction: "increase" | "decrease") {
    const length = this.places.length;
    if (direction === "increase") {
      this.selectedIndex =
        this.selectedIndex === length - 1 ? 0 : this.selectedIndex + 1;
    } else {
      this.selectedIndex =
        this.selectedIndex === 0 ? length - 1 : this.selectedIndex - 1;
    }
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
