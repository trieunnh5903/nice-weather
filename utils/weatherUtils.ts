import Units from "@/constants/Units";

const formatCelcius = (temp: number) => {
  return Math.round(temp) + Units.Celsius;
};

const formatFahrenheit = (celcius: number) => {
  return Math.round(celcius * 1.8 + 32) + Units.Fahrenheit;
};

const formatFahrenheitWithoutUnit = (celcius: number) => {
  return Math.round(celcius * 1.8 + 32) + "°";
};

const formatCelciusWithoutUnit = (temp: number) => {
  return Math.round(temp) + "°";
};

function formatSunrise(timeString: string) {
  let [time, period] = timeString.split(" ");

  let [hours, minutes] = time.split(":");

  return `${hours}:${minutes} ${period}`;
}

const convertToMinute = (time: string) => {
  let [hours, minutes] = time.split(" ")[0].split(":").map(Number);
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
  formatCelcius,
  formatSunrise,
  formatCelciusWithoutUnit,
  convertToMinute,
  getDay,
  days,
  formatFahrenheitWithoutUnit,
  formatFahrenheit,
};
