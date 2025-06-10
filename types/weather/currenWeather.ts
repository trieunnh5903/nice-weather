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

export interface CurrentWeatherResponse {
  current: CurrentWeather;
}
