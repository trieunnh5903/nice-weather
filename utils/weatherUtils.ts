import Units from "@/constants/units";

const formatCelsius = (temp: number) => {
  return Math.round(temp) + Units.Celsius;
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
