import { Place } from "@/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeAutoObservable } from "mobx";
import { makePersistable, isHydrated } from "mobx-persist-store";
class WeatherStore {
  places: { [id: string]: Place } = {};
  allPlaceIds: string[] = [];
  selectedIndex: number = -1;
  loaded: boolean = false;
  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "weatherStore",
      properties: ["places", "allPlaceIds", "selectedIndex"],
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

  get selectedPlaceId() {
    return this.allPlaceIds[this.selectedIndex];
  }

  get selectedPlace() {
    return this.places[this.selectedPlaceId];
  }

  get allPlace() {
    return this.allPlaceIds.map((id) => {
      return {
        place: this.places[id],
      };
    });
  }

  addPlace(place: Place) {
    if (!place) {
      return;
    }

    if (!this.allPlaceIds.includes(place.place_id)) {
      this.places[place.place_id] = place;
      this.allPlaceIds.push(place.place_id);
      this.selectedIndex = this.allPlaceIds.length - 1;
    } else {
      this.selectedIndex = this.allPlaceIds.indexOf(place.place_id);
    }
  }

  updateTemperature(placeId: string, temperature: number) {
    this.places[placeId] = {
      ...this.places[placeId],
      temperature,
    };
  }

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
    this.allPlaceIds = this.allPlaceIds.filter((i) => i !== placeId);
    this.setSelectedIndex(
      Math.min(this.selectedIndex, this.allPlaceIds.length - 1)
    );
  }

  deleteMany(placeIds: string[]) {
    placeIds.forEach((placeId) => {
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
    this.allPlaceIds = [];
    this.selectedIndex = -1;
  }
}

export default WeatherStore;
