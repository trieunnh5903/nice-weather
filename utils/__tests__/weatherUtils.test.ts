import { Hourly } from "@/types/weather/forecast";
import {
  convertToMinute,
  formatCelsius,
  formatFahrenheit,
  getChartData,
  getDay,
  getTemperatureText,
  getUVIndexDescription,
} from "../weatherUtils";
import units from "@/constants/units";

it("formatCelsius should format Celsius correctly", () => {
  expect(formatCelsius(25.4)).toBe("25" + units.Celsius);
});

it("formatFahrenheit should format Fahrenheit correctly", () => {
  expect(formatFahrenheit(86)).toBe("86" + units.Fahrenheit);
});

describe("getTemperatureText", () => {
  it("should return correct temperature text for metric", () => {
    expect(getTemperatureText(20, 68, "metric")).toBe("20" + units.Celsius);
  });

  it("should return correct temperature text for Fahrenheit", () => {
    expect(getTemperatureText(20, 68, "us")).toBe("68" + units.Fahrenheit);
  });
});

it("should return correct UV description", () => {
  expect(getUVIndexDescription(1)).toBe("low");
  expect(getUVIndexDescription(4)).toBe("moderate");
  expect(getUVIndexDescription(6)).toBe("high");
  expect(getUVIndexDescription(9)).toBe("very_high");
  expect(getUVIndexDescription(11)).toBe("extreme");
});

it("should convert time string to minutes correctly", () => {
  expect(convertToMinute("12:30 AM")).toBe(30);
  expect(convertToMinute("12:30 PM")).toBe(750);
  expect(convertToMinute("")).toBe(0);
});

it("should get correct day of week", () => {
  expect(getDay("2025-07-01")).toBe("Tuesday");
});

it("should return correct weekday name", () => {
  expect(getDay("2025-07-01")).toBe("Tuesday");
});

it("should convert AM/PM time to minutes", () => {
  expect(convertToMinute("12:00 AM")).toBe(0);
  expect(convertToMinute("1:30 AM")).toBe(90);
  expect(convertToMinute("12:00 PM")).toBe(720);
  expect(convertToMinute("1:30 PM")).toBe(13 * 60 + 30);
});

const mockHourly: Hourly[] = [
  {
    date: "",
    icon: 0,
    summary: "",
    weather: "",
    temperature: 22,
    wind: { speed: "", dir: "", angle: 0 },
    cloud_cover: { total: 0 },
    precipitation: { total: 0, type: "" },
  },
];

it("should return chart data from hourly", () => {
  const result = getChartData(mockHourly, "metric");
  expect(result).toEqual([{ value: 22, dataPointText: "22°" }]);
});
