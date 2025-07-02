import { weatherKeys } from "../queryKey";

describe("weatherKeys", () => {
  it("should return correct current key", () => {
    expect(weatherKeys.current("10", "20", "vi")).toEqual([
      "weather",
      "current",
      "10",
      "20",
      "vi",
    ]);
  });

  it("should return correct forecast key", () => {
    expect(weatherKeys.forecast("10", "20", "celsius")).toEqual([
      "weather",
      "forecast",
      "10",
      "20",
      "celsius",
    ]);
  });

  it("should return correct astronomy key", () => {
    expect(weatherKeys.astronomy("10", "20")).toEqual([
      "weather",
      "astronomy",
      "10",
      "20",
    ]);
  });
});
