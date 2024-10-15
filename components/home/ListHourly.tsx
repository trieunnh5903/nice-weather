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
import { useAppTheme, useSunriseSelected, useWeatherSelected } from "@/hooks";
import { weatherUtils } from "@/utils";

interface WeatherHourlyProps {
  item: Hourly;
  index: number;
  width: number;
  nextDayIndex: number;
  currentTimeIndex: number;
}

const useHourlyData = () => {
  const hourly = useWeatherSelected()?.hourly.data;
  const sunrise = useSunriseSelected();

  return useMemo(() => {
    if (!hourly || hourly.length === 0 || !sunrise)
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

    const now = new Date().toLocaleTimeString(undefined, {
      hour: "2-digit",
      timeZone: sunrise[0].timezone,
      day: "2-digit",
    });

    const currentTimeIndex = Math.max(
      0,
      hourly.findIndex((item) => {
        const date = new Date(item.date).toLocaleTimeString(undefined, {
          hour: "2-digit",
          timeZone: sunrise[0].timezone,
          day: "2-digit",
        });
        return now === date;
      })
    );

    return {
      chartData,
      nextDayIndex,
      currentTimeIndex,
      hourly,
    };
  }, [hourly, sunrise]);
};
const WeatherHourly: React.FC<WeatherHourlyProps> = React.memo(
  function WeatherHourly({
    item,
    index,
    width,
    nextDayIndex,
    currentTimeIndex,
  }) {
    const date = new Date(item.date);
    const time = date.toLocaleString("en-ES", {
      hour12: true,
      hour: "numeric",
    });
    const icon = item.icon as keyof typeof weatherIcon;
    const tag =
      index === currentTimeIndex
        ? "Today"
        : index === nextDayIndex
        ? "Tomorrow"
        : "";
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

const ListHourly = observer(() => {
  const weatherItemWidth = 70;
  const listRef = useRef<ScrollView>(null);
  const themeColor = useAppTheme();
  const textColor = themeColor.text;
  const { chartData, currentTimeIndex, nextDayIndex, hourly } = useHourlyData();

  if (!hourly || hourly.length === 0) return;
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
                  currentTimeIndex={currentTimeIndex}
                />
              );
            })}
          </ThemedView>

          <ThemedView paddingTop={13}>
            <LineChart
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
            />
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
