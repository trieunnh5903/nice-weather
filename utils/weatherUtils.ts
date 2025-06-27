import Units from "@/constants/units";
import { TemperatureUnit } from "@/types/common/unit";
import { Daily, Hourly } from "@/types/weather/forecast";
import { lineDataItem } from "react-native-gifted-charts";

const formatCelsius = (temp: number) => {
  return Math.round(temp) + Units.Celsius;
};

export const getChartData = (
  hourly: Hourly[],
  temperatureUnit: TemperatureUnit
) => {
  return hourly.map((item) => ({
    value: Math.round(item.temperature),
    dataPointText: formatTemperatureWithoutUnit(
      temperatureUnit === "metric"
        ? item.temperature
        : celsiusToFahrenheit(item.temperature)
    ),
  }));
};

export const getUVIndexDescription = (uvIndex: number) => {
  if (uvIndex <= 2) return "low";
  if (uvIndex <= 5) return "moderate";
  if (uvIndex <= 7) return "high";
  if (uvIndex <= 10) return "very_high";
  return "extreme";
};

export const formatDailyChartData = (
  daily: Daily[],
  unit: TemperatureUnit
): { tempMaxData: lineDataItem[]; tempMinData: lineDataItem[] } => {
  return {
    tempMaxData: daily.map((item) => {
      const value =
        unit === "metric"
          ? Math.round(item.all_day.temperature_max)
          : celsiusToFahrenheit(item.all_day.temperature_max);
      return {
        value,
        dataPointText: formatTemperatureWithoutUnit(value),
      };
    }),
    tempMinData: daily.map((item) => {
      const value =
        unit === "metric"
          ? Math.round(item.all_day.temperature_min)
          : celsiusToFahrenheit(item.all_day.temperature_min);
      return {
        value,
        dataPointText: formatTemperatureWithoutUnit(value),
      };
    }),
  };
};

export const getTemperatureText = (
  temp_c: number | undefined,
  temp_f: number | undefined,
  unit: TemperatureUnit
): string => {
  return !temp_c || !temp_f
    ? ""
    : unit === "metric"
    ? formatCelsius(temp_c)
    : formatFahrenheit(temp_f);
};

const formatFahrenheit = (temp: number) => {
  return Math.round(temp) + Units.Fahrenheit;
};

const formatTemperatureWithoutUnit = (temp: number) => {
  return Math.round(temp) + "°";
};

function formatSunrise(timeString: string) {
  if (!timeString) return "";
  let [time, period] = timeString?.split(" ");

  let [hours, minutes] = time?.split(":");

  return `${hours}:${minutes} ${period}`;
}

const celsiusToFahrenheit = (celsius: number) =>
  Math.round((celsius * 9) / 5 + 32);

const convertToMinute = (time: string) => {
  if (!time) return 0;
  let [hours, minutes] = time?.split(" ")[0]?.split(":").map(Number);
  const period = time.split(" ")[1];
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const getDay = (date: string) => {
  const d = new Date(date);
  const dayOfWeek = d.getDay();

  return days[dayOfWeek];
};

export default {
  formatCelsius,
  formatSunrise,
  formatTemperatureWithoutUnit,
  convertToMinute,
  getDay,
  days,
  formatFahrenheit,
  celsiusToFahrenheit,
};
