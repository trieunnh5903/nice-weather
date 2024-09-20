import Units from "@/constants/Units";

const formatCelcius = (temp: number) => {
  return Math.round(temp) + Units.Celsius;
};

export default { formatCelcius };
