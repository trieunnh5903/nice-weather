import { mockPlace, mockPlace2 } from "@/__mock__/place.mock";
import WeatherStore from "../WeatherStore";
import { stopPersisting } from "mobx-persist-store";

describe("WeatherStore", () => {
  let store: WeatherStore;

  beforeEach(() => {
    stopPersisting(store);
    store = new WeatherStore();
  });

  it("should add a place and set selectedIndex", () => {
    store.addPlace(mockPlace);

    expect(store.places).toHaveLength(1);
    expect(store.selectedIndex).toBe(0);
    expect(store.selectedPlace).toEqual(mockPlace);
  });

  it("should not add duplicate places", () => {
    store.addPlace(mockPlace);
    store.addPlace(mockPlace);

    expect(store.places).toHaveLength(1);
    expect(store.selectedIndex).toBe(0);
  });

  it("should change selectedIndex if place already exists", () => {
    store.addPlace(mockPlace);
    store.addPlace(mockPlace2);
    store.addPlace(mockPlace); // trùng

    expect(store.places).toHaveLength(2);
    expect(store.selectedIndex).toBe(0); // quay lại mockPlace
  });

  it("should delete a place correctly and update selectedIndex", () => {
    store.setPlaces([mockPlace, mockPlace2]);
    store.setSelectedIndex(1);

    store.deletePlace(mockPlace2.place_id);

    expect(store.places).toHaveLength(1);
    expect(store.selectedPlace).toEqual(mockPlace);
    expect(store.selectedIndex).toBe(0);
  });

  it("should delete all places", () => {
    store.setPlaces([mockPlace, mockPlace2]);
    store.setSelectedIndex(1);

    store.deleteAll();

    expect(store.places).toHaveLength(0);
    expect(store.selectedIndex).toBe(-1);
  });

  it("should delete many places and update selectedIndex", () => {
    store.setPlaces([mockPlace, mockPlace2]);
    store.setSelectedIndex(1);

    store.deleteMany([mockPlace.place_id, mockPlace2.place_id]);

    expect(store.places).toHaveLength(0);
    expect(store.selectedIndex).toBe(-1);
  });

  it("should change temperature unit", () => {
    store.changeTemperatureUnit("us");
    expect(store.temperatureUnit).toBe("us");
  });

  it("should change theme", () => {
    store.changeTheme("dark");
    expect(store.theme).toBe("dark");
  });

  it("should change stale time", () => {
    store.changeStaleTime(7200);
    expect(store.stateTime).toBe(7200);
  });
});
