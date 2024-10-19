import { StyleSheet } from "react-native";
import React, { useMemo } from "react";
import { observer } from "mobx-react-lite";
import { useAppTheme } from "@/hooks";
import {
  LineChart,
  lineDataItem,
  yAxisSides,
} from "react-native-gifted-charts";
import { weatherUtils } from "@/utils";
import ThemedView from "../ThemedView";
import ThemedText from "../ThemedText";
import { ScrollView } from "react-native-gesture-handler";
import weatherIcon from "@/config/weatherIcon";
import { Image } from "expo-image";
import { Daily } from "@/type";

interface WeatherDailyProps {
  item: Daily;
  index: number;
  width: number;
}
interface TemperatureChartProps {
  data: lineDataItem[];
  weatherItemWidth: number;
}

interface ListDailyProps {
  daily: Daily[];
}
const ListDaily = observer(({ daily }: ListDailyProps) => {
  // const daily = useWeatherSelected()?.daily.data;
  const weatherItemWidth = 90;

  const { tempMaxData, tempMinData } = useMemo(() => {
    if (daily.length === 0) {
      return {
        tempMaxData: [],
        tempMinData: [],
      };
    }

    let tempMaxData: lineDataItem[] = [];
    let tempMinData: lineDataItem[] = [];

    daily.forEach((item) => {
      const tempMaxValue = Math.round(item.all_day.temperature_max);
      const tempMinValue = Math.round(item.all_day.temperature_min);

      tempMaxData.push({
        value: tempMaxValue,
        dataPointText: weatherUtils.formatTemperatureWithoutUnit(tempMaxValue),
      });
      tempMinData.push({
        value: tempMinValue,
        dataPointText: weatherUtils.formatTemperatureWithoutUnit(tempMinValue),
      });
    });

    return {
      tempMaxData,
      tempMinData,
    };
  }, [daily]);
  if (daily.length === 0) return null;
  return (
    <ThemedView>
      <ThemedView paddingHorizontal={12}>
        <ThemedText uppercase type="subtitle">
          daily
        </ThemedText>
      </ThemedView>
      <ScrollView showsHorizontalScrollIndicator={false} horizontal>
        <ThemedView>
          <ThemedView style={styles.row}>
            {daily.map((item, index) => {
              return (
                <WeatherDaily
                  key={item.day}
                  item={item}
                  index={index}
                  width={weatherItemWidth}
                />
              );
            })}
          </ThemedView>
          <ThemedView paddingTop={13}>
            <TemperatureChart
              data={tempMaxData}
              weatherItemWidth={weatherItemWidth}
            />
          </ThemedView>
          <ThemedView paddingTop={13}>
            <TemperatureChart
              data={tempMinData}
              weatherItemWidth={weatherItemWidth}
            />
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
});

const WeatherDaily: React.FC<WeatherDailyProps> = React.memo(
  function WeatherDaily({ index, item, width }) {
    const icon = item.icon as keyof typeof weatherIcon;
    const day = weatherUtils.getDay(item.day);
    const tag =
      index === 0 ? "Today" : day === weatherUtils.days[1] ? "Next week" : "";

    return (
      <ThemedView style={styles.centered}>
        <ThemedText type="label">{tag}</ThemedText>
        <ThemedView
          padding={6}
          paddingTop={0}
          style={[{ width }, styles.centered]}
        >
          <ThemedText>{day}</ThemedText>
          <Image source={weatherIcon[icon]} style={{ width: 24, height: 24 }} />
          <ThemedView style={[styles.row, styles.centered]}>
            <Image source={weatherIcon[7]} style={{ width: 16, height: 16 }} />
            <ThemedView paddingLeft={2}>
              <ThemedText fontSize={12}>
                {item.all_day.cloud_cover.total}%
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    );
  }
);

const TemperatureChart: React.FC<TemperatureChartProps> = React.memo(
  function TemperatureChart({ data, weatherItemWidth }) {
    const textColor = useAppTheme().text;
    return (
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
        isAnimated
        hideAxesAndRules
        xAxisLabelsHeight={0}
        overflowTop={10}
        animateOnDataChange
        height={30}
      />
    );
  }
);

export default ListDaily;

const styles = StyleSheet.create({
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
  },
});
