import { StyleSheet } from "react-native";
import React, { memo, useMemo, useRef } from "react";
import ThemedView from "../ThemedView";
import ThemedText from "../ThemedText";
import { ScrollView } from "react-native-gesture-handler";
import { Hourly, TemperatureUnit } from "@/type";
import weatherIcon from "@/config/weatherIcon";
import { Image } from "expo-image";
import { weatherUtils } from "@/utils";
import TemperatureChart from "./TemperatureChart";
import { useTranslation } from "react-i18next";

interface WeatherHourlyProps {
  item: Hourly;
  index: number;
  width: number;
  nextDayIndex: number;
}

interface ListHourlyProps {
  hourly: Hourly[];
  temperatureUnit: TemperatureUnit;
}

const useHourlyData = ({ hourly, temperatureUnit }: ListHourlyProps) => {
  return useMemo(() => {
    if (hourly.length === 0)
      return {
        chartData: [],
        nextDayIndex: 0,
        currentTimeIndex: 0,
      };

    const chartData =
      temperatureUnit === "metric"
        ? hourly.map((item) => ({
            value: Math.round(item.temperature),
            dataPointText: weatherUtils.formatTemperatureWithoutUnit(
              item.temperature
            ),
          }))
        : hourly.map((item) => ({
            value: Math.round(item.temperature),
            dataPointText: weatherUtils.formatTemperatureWithoutUnit(
              weatherUtils.celsiusToFahrenheit(item.temperature)
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
  }, [hourly, temperatureUnit]);
};

const WeatherHourly: React.FC<WeatherHourlyProps> = React.memo(
  function WeatherHourly({ item, index, width, nextDayIndex }) {
    const { t } = useTranslation();
    const date = new Date(item.date);
    const time = date.toLocaleString("en-ES", {
      hour12: true,
      hour: "numeric",
    });
    const icon = item.icon as keyof typeof weatherIcon;
    const tag =
      index === 0
        ? t("home.feature.hourly.today")
        : index === nextDayIndex
        ? t("home.feature.hourly.tomorrow")
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

const ListHourly = ({ hourly, temperatureUnit }: ListHourlyProps) => {
  const { t } = useTranslation();
  const weatherItemWidth = 70;
  const listRef = useRef<ScrollView>(null);
  const { chartData, nextDayIndex } = useHourlyData({
    hourly,
    temperatureUnit,
  });
  if (hourly.length === 0) return null;
  return (
    <ThemedView>
      <ThemedView paddingHorizontal={12}>
        <ThemedText uppercase type="subtitle">
          {t("home.feature.hourly.title")}
        </ThemedText>
      </ThemedView>
      <ScrollView
        ref={listRef}
        showsHorizontalScrollIndicator={false}
        horizontal
      >
        <ThemedView>
          <ThemedView paddingLeft={10} style={styles.row}>
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

          <ThemedView paddingTop={24}>
            <TemperatureChart
              data={chartData}
              weatherItemWidth={weatherItemWidth}
            />
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
};

export default memo(ListHourly);

const styles = StyleSheet.create({
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
});
