import Units from "@/constants/Units";

const formatCelcius = (temp: number) => {
  return Math.floor(temp) + Units.Celsius;
};

export default { formatCelcius };
