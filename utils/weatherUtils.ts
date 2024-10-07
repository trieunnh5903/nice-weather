import Units from "@/constants/Units";

const formatCelcius = (temp: number) => {
  return Math.round(temp) + Units.Celsius;
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

const periodOfSunriseAndSunset = (sunrise: string, sunset: string) => {
  const sunriseMinutes = convertToMinute(sunrise);
  const sunsetMinutes = convertToMinute(sunset);

  return sunsetMinutes - sunriseMinutes;
};
export default {
  formatCelcius,
  formatSunrise,
  periodOfSunriseAndSunset,
  formatCelciusWithoutUnit,
  convertToMinute,
  getDay,
  days,
};
