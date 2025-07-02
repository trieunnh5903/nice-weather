import { TemperatureUnit } from "../common/unit";

export interface Forecast {
  lat: string;
  lon: string;
  elevation: number;
  timezone: string;
  units: TemperatureUnit;
  hourly: {
    data: Hourly[];
  };
  daily: {
    data: Daily[];
  };
}

export interface Hourly {
  date: string;
  weather: string;
  icon: number;
  summary: string;
  temperature: number;
  wind: {
    speed: string;
    dir: string;
    angle: number;
  };
  cloud_cover: {
    total: number;
  };
  precipitation: {
    total: number;
    type: string;
  };
}

export interface Daily {
  day: string;
  weather: string;
  icon: number;
  summary: string;
  all_day: {
    weather: string;
    icon: number;
    temperature: number;
    temperature_min: number;
    temperature_max: number;
    wind: {
      speed: number;
      dir: string;
      angle: number;
    };
    cloud_cover: {
      total: number;
    };
    precipitation: {
      total: number;
      type: string;
    };
  };
  morning: null;
  afternoon: null;
  evening: null;
}
