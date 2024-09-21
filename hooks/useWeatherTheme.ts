import { Colors } from "@/constants/Colors";
import { useAssets } from "expo-asset";

interface WeatherTheme {
  weatherCode: number;
  iconCode: string;
}

export const lightTextColor = "#f5f5f5";

export function useWeatherTheme({ iconCode, weatherCode }: WeatherTheme) {
  const [assets] = useAssets([
    require("../assets/images/weather/sunny.jpg"),
    require("../assets/images/weather/night.jpg"),
    require("../assets/images/weather/cloud.jpg"),
    require("../assets/images/weather/thunder.jpg"),
    require("../assets/images/weather/rain.jpg"),
  ]);

  if (!assets) return;

  switch (true) {
    case weatherCode < 300:
      // Thunderstorm
      return {
        asset: assets[3],
        textColor: lightTextColor,
        backgroundColor: "#010812",
      };

    case weatherCode >= 300 && weatherCode < 550:
      // Rain
      return {
        asset: assets[4],
        textColor: lightTextColor,
        backgroundColor: "#030305",
      };

    case weatherCode === 800:
      // Clear sky
      return iconCode === "01d"
        ? {
            asset: assets[0],
            textColor: lightTextColor,
            backgroundColor: "#3494d1",
          }
        : {
            asset: assets[1],
            textColor: lightTextColor,
            backgroundColor: "#04173f",
          };

    case weatherCode > 800:
      // Clouds
      return {
        asset: assets[2],
        textColor: lightTextColor,
        backgroundColor: "#001a2b",
      };

    default:
      return;
  }
}
