import { CurrentWeatherResponse } from "@/types/weather/currenWeather";

import { Forecast } from "@/types/weather/forecast";

export const mockForecast: Forecast = {
  lat: "21.03",
  lon: "105.85",
  elevation: 12.0,
  timezone: "Asia/Bangkok",
  units: "metric",

  hourly: {
    data: [
      {
        date: "2025-06-29T08:00:00Z",
        weather: "Sunny",
        icon: 1000,
        summary: "Clear sky",
        temperature: 32.5,
        wind: {
          speed: "10 km/h",
          dir: "E",
          angle: 90,
        },
        cloud_cover: {
          total: 5,
        },
        precipitation: {
          total: 0,
          type: "none",
        },
      },
    ],
  },

  daily: {
    data: [
      {
        day: "2025-06-29",
        weather: "Sunny",
        icon: 1000,
        summary: "A hot and sunny day",
        all_day: {
          weather: "Sunny",
          icon: 1000,
          temperature: 34,
          temperature_min: 27,
          temperature_max: 36,
          wind: {
            speed: 12,
            dir: "E",
            angle: 90,
          },
          cloud_cover: {
            total: 10,
          },
          precipitation: {
            total: 0,
            type: "none",
          },
        },
        morning: null,
        afternoon: null,
        evening: null,
      },
    ],
  },
};

export const mockCurrentWeatherResponse: CurrentWeatherResponse = {
  current: {
    last_updated: "2025-06-29 08:45",
    last_updated_epoch: 1719979500,
    temp_c: 33.5,
    temp_f: 92.3,
    feelslike_c: 37.0,
    feelslike_f: 98.6,
    windchill_c: 33.5,
    windchill_f: 92.3,
    heatindex_c: 40.2,
    heatindex_f: 104.4,
    dewpoint_c: 26.1,
    dewpoint_f: 79.0,
    condition: {
      text: "Sunny",
      icon: "//cdn.weatherapi.com/weather/64x64/day/113.png",
      code: 1000,
    },
    wind_mph: 6.2,
    wind_kph: 10.0,
    wind_degree: 90,
    wind_dir: "E",
    pressure_mb: 1010.0,
    pressure_in: 29.83,
    precip_mm: 0.0,
    precip_in: 0.0,
    humidity: 60,
    cloud: 10,
    is_day: 1,
    uv: 7.0,
    gust_mph: 9.4,
    gust_kph: 15.1,
    air_quality: {
      "us-epa-index": 2,
    },
  },
};
