import { useAppTheme } from "@/hooks";
import React from "react";
import {
  LineChart,
  LineChartPropsType,
  lineDataItem,
  yAxisSides,
} from "react-native-gifted-charts";
import ThemedView from "../ThemedView";

interface TemperatureChartProps extends LineChartPropsType {
  data: lineDataItem[];
  weatherItemWidth: number;
}

const TemperatureChart: React.FC<TemperatureChartProps> = React.memo(
  function TemperatureChart({ data, weatherItemWidth }) {
    const textColor = useAppTheme().text;
    const values = data.map((item) => item.value);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    return (
      <ThemedView>
        <LineChart
          yAxisSide={yAxisSides.RIGHT}
          disableScroll
          data={data}
          adjustToWidth
          textFontSize={13}
          textShiftY={-6}
          color={textColor}
          dataPointsColor={textColor}
          textShiftX={-6}
          trimYAxisAtTop
          initialSpacing={weatherItemWidth / 2}
          textColor={textColor}
          spacing={weatherItemWidth}
          xAxisLabelsHeight={0}
          hideAxesAndRules
          overflowTop={10}
          stepHeight={5}
          noOfSections={5}
          yAxisOffset={minValue}
          stepValue={(maxValue - minValue) / 5}
        />
      </ThemedView>
    );
  }
);
export default TemperatureChart;
