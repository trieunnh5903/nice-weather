export const QUERY_KEY = {
  CURRENT_WEATHER: "currentWeather",
  FORECAST: "forecast",
  ASTRONOMY: "astronomy",
};

export const weatherKeys = {
  all: ["weather"] as const,

  current: (lat: string, lon: string, lang: string) =>
    [...weatherKeys.all, "current", lat, lon, lang] as const,

  forecast: (lat: string, lon: string, unit: string) =>
    [...weatherKeys.all, "forecast", lat, lon, unit] as const,

  astronomy: (lat: string, lon: string) =>
    [...weatherKeys.all, "astronomy", lat, lon] as const,
};
