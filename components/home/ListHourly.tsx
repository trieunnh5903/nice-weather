import { StyleSheet } from "react-native";
import React, { useMemo, useRef } from "react";
import { observer } from "mobx-react-lite";
import ThemedView from "../ThemedView";
import ThemedText from "../ThemedText";
import { ScrollView } from "react-native-gesture-handler";
import { LineChart, yAxisSides } from "react-native-gifted-charts";
import { Hourly } from "@/type";
import weatherIcon from "@/config/weatherIcon";
import { Image } from "expo-image";
import { useAppTheme } from "@/hooks";
import { weatherUtils } from "@/utils";
import TemperatureChart from "./TemperatureChart";

interface WeatherHourlyProps {
  item: Hourly;
  index: number;
  width: number;
  nextDayIndex: number;
}

interface ListHourlyProps {
  hourly: Hourly[];
  timezone: string;
}

const useHourlyData = ({ hourly, timezone }: ListHourlyProps) => {
  return useMemo(() => {
    if (hourly.length === 0)
      return {
        chartData: [],
        nextDayIndex: 0,
        currentTimeIndex: 0,
      };

    const chartData = hourly.map((item) => ({
      value: Math.round(item.temperature),
      dataPointText: weatherUtils.formatTemperatureWithoutUnit(
        item.temperature
      ),
    }));

    const firstHour = new Date(hourly[0].date);
    const nextDayIndex = hourly.findIndex((item) => {
      const date = new Date(item.date);
      return firstHour.getHours() > date.getHours();
    });

    return {
      chartData,
      nextDayIndex,
    };
  }, [hourly]);
};
const WeatherHourly: React.FC<WeatherHourlyProps> = React.memo(
  function WeatherHourly({ item, index, width, nextDayIndex }) {
    const date = new Date(item.date);
    const time = date.toLocaleString("en-ES", {
      hour12: true,
      hour: "numeric",
    });
    const icon = item.icon as keyof typeof weatherIcon;
    const tag =
      index === 0 ? "Today" : index === nextDayIndex ? "Tomorrow" : "";
    return (
      <ThemedView style={styles.centered}>
        <ThemedText type="label">{tag}</ThemedText>
        <ThemedView
          padding={6}
          style={[{ width, paddingTop: 0 }, styles.centered]}
        >
          <ThemedText>{time}</ThemedText>
          <Image source={weatherIcon[icon]} style={{ width: 24, height: 24 }} />
          <ThemedView style={[styles.row, styles.centered]}>
            <Image source={weatherIcon[7]} style={{ width: 16, height: 16 }} />
            <ThemedView paddingLeft={2}>
              <ThemedText fontSize={12}>{item.cloud_cover.total}%</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    );
  }
);

const ListHourly = observer(({ hourly, timezone }: ListHourlyProps) => {
  const weatherItemWidth = 70;
  const listRef = useRef<ScrollView>(null);
  const themeColor = useAppTheme();
  const { chartData, nextDayIndex } = useHourlyData({
    hourly,
    timezone,
  });
  const textColor = themeColor.text;
  if (hourly.length === 0) return null;
  return (
    <ThemedView>
      <ThemedView paddingHorizontal={12}>
        <ThemedText uppercase type="subtitle">
          Hourly
        </ThemedText>
      </ThemedView>
      <ScrollView
        ref={listRef}
        showsHorizontalScrollIndicator={false}
        horizontal
      >
        <ThemedView>
          <ThemedView style={styles.row}>
            {hourly.map((item, index) => {
              return (
                <WeatherHourly
                  key={item.date}
                  item={item}
                  index={index}
                  width={weatherItemWidth}
                  nextDayIndex={nextDayIndex}
                />
              );
            })}
          </ThemedView>

          <ThemedView paddingTop={13}>
            <TemperatureChart
              data={chartData}
              weatherItemWidth={weatherItemWidth}
            />
            {/* <LineChart
              yAxisSide={yAxisSides.RIGHT}
              disableScroll
              data={chartData}
              adjustToWidth
              textFontSize={13}
              textShiftY={-6}
              textShiftX={-6}
              color={textColor}
              dataPointsColor={textColor}
              trimYAxisAtTop
              initialSpacing={weatherItemWidth / 2}
              textColor={textColor}
              spacing={weatherItemWidth}
              isAnimated
              hideAxesAndRules
              xAxisLabelsHeight={0}
              overflowTop={10}
              animateOnDataChange
              height={50}
            /> */}
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
});

export default ListHourly;

const styles = StyleSheet.create({
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
});
