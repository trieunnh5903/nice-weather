import React from "react";
import { render } from "@testing-library/react-native";
import { WeatherCondition } from "../WeatherCondition";

describe("WeatherCondition", () => {
  it("renders condition text", () => {
    const { getByText } = render(
      <WeatherCondition conditionText="Partly cloudy" />
    );

    expect(getByText("Partly cloudy")).toBeTruthy();
  });
});
