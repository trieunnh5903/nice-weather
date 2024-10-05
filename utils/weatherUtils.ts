import Units from "@/constants/Units";

const formatCelcius = (temp: number) => {
  return Math.round(temp) + Units.Celsius;
};

function formatSunrise(timeString: string) {
  let [time, period] = timeString.split(" ");

  let [hours, minutes] = time.split(":");

  return `${hours}:${minutes} ${period}`;
}

const convertTo24Hour = (time: string) => {
  let [hours, minutes] = time.split(" ")[0].split(":").map(Number);
  const period = time.split(" ")[1];
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const periodOfSunriseAndSunset = (sunrise: string, sunset: string) => {
  const sunriseMinutes = convertTo24Hour(sunrise);
  const sunsetMinutes = convertTo24Hour(sunset);

  return sunsetMinutes - sunriseMinutes;
};
export default {
  formatCelcius,
  formatSunrise,
  periodOfSunriseAndSunset,
  convertTo24Hour,
};
