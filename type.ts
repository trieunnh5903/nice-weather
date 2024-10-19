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

interface Condition {
  text: string;
  icon: string;
  code: number;
}

export interface CurrentWeather {
  last_updated: string;
  last_updated_epoch: number;
  temp_c: number;
  temp_f: number;
  feelslike_c: number;
  feelslike_f: number;
  windchill_c: number;
  windchill_f: number;
  heatindex_c: number;
  heatindex_f: number;
  dewpoint_c: number;
  dewpoint_f: number;
  condition: Condition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  is_day: 1 | 0;
  uv: number;
  gust_mph: number;
  gust_kph: number;
  air_quality: {
    ["us-epa-index"]: number;
  };
}
// 1 means Good
// 2 means Moderate
// 3 means Unhealthy for sensitive group
// 4 means Unhealthy
// 5 means Very Unhealthy
// 6 means Hazardous
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

export interface Astronomy {
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
