import weatherIconMapping from "@/config/weatherIcon";
import { MaterialIcons } from "@expo/vector-icons";

export type WatherIcon = keyof typeof weatherIconMapping;

// export interface Province {
//   name: string;
//   local_names: {
//     [languageCode: string]: string;
//   };
//   lat: number;
//   lon: number;
//   country: string;
//   state?: string;
//   isUserLocation?: boolean;
// }

// export interface Forecast {
//   cod: string;
//   message: number;
//   cnt: number;
//   list: {
//     dt: number;
//     main: {
//       temp: number;
//       feels_like: number;
//       temp_min: number;
//       temp_max: number;
//       pressure: number;
//       sea_level: number;
//       grnd_level: number;
//       humidity: number;
//       temp_kf: number;
//     };
//     weather: {
//       id: number;
//       main: string;
//       description: string;
//       icon: string;
//     }[];
//     clouds: {
//       all: number;
//     };
//     wind: {
//       speed: number;
//       deg: number;
//       gust: number;
//     };
//     visibility: number;
//     pop: number;
//     sys: {
//       pod: string;
//     };
//     dt_txt: string;
//   }[];
//   city: City;
// }

// export interface City {
//   id: number;
//   name: string;
//   coord: {
//     lat: number;
//     lon: number;
//   };
//   country: number;
//   population: number;
//   timezone: number;
//   sunrise: number;
//   sunset: number;
// }

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
  results: {
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
  }[];
  status: string;
}

export interface Weather {
  lat: string;
  lon: string;
  elevation: number;
  timezone: string;
  units: string;
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
