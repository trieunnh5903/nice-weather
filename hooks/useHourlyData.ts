import { TemperatureUnit } from "@/types/common/unit";
import { Hourly } from "@/types/weather/forecast";
import { getChartData } from "@/utils/weatherUtils";
import { useMemo } from "react";

interface Props {
  hourly: Hourly[];
  temperatureUnit: TemperatureUnit;
}

export const useHourlyData = ({ hourly, temperatureUnit }: Props) => {
  return useMemo(() => {
    if (hourly.length === 0)
      return {
        chartData: [],
        nextDayIndex: 0,
        currentTimeIndex: 0,
      };

    const chartData = getChartData(hourly, temperatureUnit);
    const firstHour = new Date(hourly[0].date);
    const nextDayIndex = hourly.findIndex((item) => {
      const date = new Date(item.date);
      return date.getDate() !== firstHour.getDate();
    });

    return {
      chartData,
      nextDayIndex,
    };
  }, [hourly, temperatureUnit]);
};
