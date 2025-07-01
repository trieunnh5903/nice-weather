import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { WeatherItem } from "../WeatherItem";
import { Place } from "@/types/weather/place";

jest.mock("@/hooks/common", () => ({
  useAppTheme: () => ({
    ripple: "#ddd",
    icon: "#000",
  }),
}));
jest.mock("@expo/vector-icons", () => ({
  MaterialIcons: ({ name }: any) => {
    const { Text } = require("react-native");
    return <Text>{name}</Text>;
  },
}));
jest.mock("@/utils", () => ({
  placeUtils: {
    getAddress: jest.fn().mockReturnValue("123 Street, City"),
  },
}));

describe("WeatherItem", () => {
  const place: Place = {
    place_id: "abc",
    name: "Hà Nội",
    isUserLocation: true,
    adm_area1: "",
    adm_area2: "",
    country: "",
    lat: "21.0285",
    lon: "105.8542",
    timezone: "Asia/Ho_Chi_Minh",
    type: "city",
  };

  const mockOnPress = jest.fn();

  it("renders place name and address", () => {
    const { getByText } = render(
      <WeatherItem
        place={place}
        index={0}
        selectedItems={[]}
        temperature="30°C"
        onLocationPress={mockOnPress}
        progress={{ value: 0 } as any}
      />
    );

    expect(getByText("Hà Nội")).toBeTruthy();
    expect(getByText("123 Street, City")).toBeTruthy();
    expect(getByText("30°C")).toBeTruthy();
  });

  it("shows selected icon if place is selected", () => {
    const { getByText, queryByText } = render(
      <WeatherItem
        place={place}
        index={1}
        selectedItems={["abc"]}
        temperature="28°C"
        onLocationPress={mockOnPress}
        progress={{ value: 0 } as any}
      />
    );

    expect(getByText("check-circle")).toBeTruthy();
    expect(queryByText("radio-button-unchecked")).toBeFalsy();
  });

  it("hides selected icon if place is unselected", () => {
    const { getByText, queryByText } = render(
      <WeatherItem
        place={place}
        index={1}
        selectedItems={[]}
        temperature="28°C"
        onLocationPress={mockOnPress}
        progress={{ value: 0 } as any}
      />
    );

    expect(queryByText("check-circle")).toBeFalsy();
    expect(getByText("radio-button-unchecked")).not.toBeFalsy();
  });

  it("shows user location icon if place is user location", () => {
    const { getByText } = render(
      <WeatherItem
        place={place}
        index={2}
        selectedItems={[]}
        temperature="25°C"
        onLocationPress={mockOnPress}
        progress={{ value: 0 } as any}
      />
    );

    expect(getByText("location-on")).toBeTruthy();
  });

  it("hides user location icon if place isn't user location", () => {
    const { queryByText } = render(
      <WeatherItem
        place={{ ...place, isUserLocation: false }}
        index={2}
        selectedItems={[]}
        temperature="25°C"
        onLocationPress={mockOnPress}
        progress={{ value: 0 } as any}
      />
    );

    expect(queryByText("location-on")).toBeFalsy();
  });

  it("calls onLocationPress with correct params when pressed", () => {
    const { getByText } = render(
      <WeatherItem
        place={place}
        index={2}
        selectedItems={[]}
        temperature="25°C"
        onLocationPress={mockOnPress}
        progress={{ value: 0 } as any}
      />
    );

    fireEvent.press(getByText("Hà Nội"));
    expect(mockOnPress).toHaveBeenCalledWith(2, "abc");
  });
});
