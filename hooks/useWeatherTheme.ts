import { Colors } from "@/constants/Colors";

interface WeatherTheme {
  weatherCode: number;
  iconCode: string;
}

export const lightTextColor = Colors.dark.text;

export function useWeatherTheme({ iconCode, weatherCode }: WeatherTheme) {
  switch (true) {
    case weatherCode < 300:
      // Thunderstorm
      return {
        asset: require("../assets/images/weather/thunder.jpg"),
        textColor: lightTextColor,
        backgroundColor: "#010812",
        rippleColor: Colors.dark.ripple,
      };

    case weatherCode >= 300 && weatherCode < 550:
      // Rain
      return {
        asset: require("../assets/images/weather/rain.jpg"),
        textColor: lightTextColor,
        backgroundColor: "#030305",
        rippleColor: Colors.dark.ripple,
      };

    case weatherCode === 800:
      // Clear sky
      return iconCode === "01d"
        ? {
            asset: require("../assets/images/weather/sunny.jpg"),
            textColor: lightTextColor,
            backgroundColor: "#3494d1",
            rippleColor: Colors.dark.ripple,
          }
        : {
            asset: require("../assets/images/weather/night.jpg"),
            textColor: lightTextColor,
            backgroundColor: "#04173f",
            rippleColor: Colors.dark.ripple,
          };

    case weatherCode > 800:
      // Clouds
      return {
        asset: require("../assets/images/weather/cloud.jpg"),
        textColor: lightTextColor,
        backgroundColor: "#001a2b",
        rippleColor: Colors.dark.ripple,
      };

    default:
      return;
  }
}
