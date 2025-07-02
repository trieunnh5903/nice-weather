import { Hourly } from "@/types/weather/forecast";

export const mockHourlyItem: Hourly = {
  date: "2025-06-28T09:00:00Z",
  weather: "Partly Cloudy",
  icon: 2,
  summary: "Partly cloudy with mild breeze",
  temperature: 30,
  wind: {
    speed: "15 km/h",
    dir: "E",
    angle: 90,
  },
  cloud_cover: {
    total: 42,
  },
  precipitation: {
    total: 0,
    type: "none",
  },
};
