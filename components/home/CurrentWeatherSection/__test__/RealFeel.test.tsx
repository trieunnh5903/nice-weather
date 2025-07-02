import React from "react";
import { render } from "@testing-library/react-native";
import { RealFeel } from "../RealFeel";
import { getTemperatureText } from "@/utils/weatherUtils";

jest.mock("@/utils/weatherUtils", () => ({
  getTemperatureText: jest.fn(),
}));

describe("RealFeel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correct temperature text for Celsius", () => {
    (getTemperatureText as jest.Mock).mockReturnValue("27°C");

    const { getByText } = render(
      <RealFeel feelslike_c={27} feelslike_f={80.6} temperatureUnit="metric" />
    );

    expect(getTemperatureText).toHaveBeenCalledWith(27, 80.6, "metric");
    expect(
      getByText("home.feature.curren_weather.feel_like 27°C")
    ).toBeTruthy();
  });

  it("renders correct temperature text for Fahrenheit", () => {
    (getTemperatureText as jest.Mock).mockReturnValue("80.6°F");

    const { getByText } = render(
      <RealFeel feelslike_c={27} feelslike_f={80.6} temperatureUnit="us" />
    );

    expect(getTemperatureText).toHaveBeenCalledWith(27, 80.6, "us");
    expect(getByText("home.feature.curren_weather.feel_like 80.6°F")).toBeTruthy();
  });
});
