import { Daily } from "@/types/weather/forecast";

export const mockDailyItem: Daily = {
  day: "2025-06-29",
  weather: "Cloudy",
  icon: 3,
  summary: "Cloudy with light breeze",
  all_day: {
    weather: "Cloudy",
    icon: 3,
    temperature: 28,
    temperature_min: 25,
    temperature_max: 31,
    wind: {
      speed: 10,
      dir: "E",
      angle: 90,
    },
    cloud_cover: {
      total: 67,
    },
    precipitation: {
      total: 0,
      type: "none",
    },
  },
  morning: null,
  afternoon: null,
  evening: null,
};
