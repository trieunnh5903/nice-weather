import weatherIconMapping from "@/config/weatherIcon";
import { MaterialIcons } from "@expo/vector-icons";

export type WatherIcon = keyof typeof weatherIconMapping;

export type TemperatureUnit = "metric" | "us";

export type MaterialIconName = React.ComponentProps<
  typeof MaterialIcons
>["name"];

export interface Place {
  name: string;
  place_id: string;
  adm_area1: string | null;
  adm_area2: string | null;
  country: string;
  lat: string;
  lon: string;
  timezone: string;
  type: string;
  isUserLocation?: boolean;
  temperature?: number;
}

export interface Sunrise {
  date: string;
  sunrise: string;
  sunset: string;
  first_light: string;
  last_light: string;
  dawn: string;
  dusk: string;
  solar_noon: string;
  golden_hour: string;
  day_length: string;
  timezone: string;
  utc_offset: number;
}
export interface SunriseResponse {
  results: Sunrise[];
  status: string;
}

export interface Weather {
  lat: string;
  lon: string;
  elevation: number;
  timezone: string;
  units: TemperatureUnit;
  current: CurrentWeather;
  hourly: {
    data: Hourly[];
  };
  daily: {
    data: Daily[];
  };
}

export interface CurrentWeather {
  icon: string;
  icon_num: number;
  summary: string;
  temperature: number;
  wind: {
    speed: number;
    angle: number;
    dir: string;
  };
  precipitation: {
    total: number;
    type: string;
  };
  cloud_cover: number;
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
