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
    let chartData: {
      value: number;
      dataPointText: string;
    }[] = [];
    let nextDayIndex = 0;
    let currentTimeIndex = 0;

    if (hourly.length > 0) {
      chartData = getChartData(hourly, temperatureUnit);

      const firstHour = new Date(hourly[0].date);
      nextDayIndex = hourly.findIndex((item) => {
        const date = new Date(item.date);
        return date.getDate() !== firstHour.getDate();
      });

      const now = new Date();
      currentTimeIndex = hourly.findIndex((item) => {
        const hour = new Date(item.date);
        return (
          hour.getHours() >= now.getHours() && hour.getDate() === now.getDate()
        );
      });
      if (currentTimeIndex === -1) currentTimeIndex = 0;
    }

    return {
      chartData,
      nextDayIndex,
      currentTimeIndex,
    };
  }, [hourly, temperatureUnit]);
};
