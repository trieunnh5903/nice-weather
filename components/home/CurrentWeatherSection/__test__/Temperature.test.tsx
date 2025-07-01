import React from "react";
import { render } from "@testing-library/react-native";
import { Temperature } from "../Temperature";
import { getTemperatureText } from "@/utils/weatherUtils";

// Mock getTemperatureText
jest.mock("@/utils/weatherUtils", () => ({
  getTemperatureText: jest.fn(),
}));

describe("Temperature", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders temperature in Celsius", () => {
    (getTemperatureText as jest.Mock).mockReturnValue("28°C");

    const { getByText } = render(
      <Temperature temp_c={28} temp_f={82.4} temperatureUnit="metric" />
    );

    expect(getTemperatureText).toHaveBeenCalledWith(28, 82.4, "metric");
    expect(getByText("28°C")).toBeTruthy();
  });

  it("renders temperature in Fahrenheit", () => {
    (getTemperatureText as jest.Mock).mockReturnValue("82.4°F");

    const { getByText } = render(
      <Temperature temp_c={28} temp_f={82.4} temperatureUnit="us" />
    );

    expect(getTemperatureText).toHaveBeenCalledWith(28, 82.4, "us");
    expect(getByText("82.4°F")).toBeTruthy();
  });

  it("applies correct style", () => {
    (getTemperatureText as jest.Mock).mockReturnValue("30°C");

    const { getByText } = render(
      <Temperature temp_c={30} temp_f={86} temperatureUnit="metric" />
    );

    const text = getByText("30°C");

    const mergedStyle = Array.isArray(text.props.style)
      ? Object.assign({}, ...text.props.style)
      : text.props.style;

    expect(mergedStyle.fontSize).toBe(70);
  });
});
