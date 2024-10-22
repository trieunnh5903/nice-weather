import { StyleSheet } from "react-native";
import React, { useMemo } from "react";
import { observer } from "mobx-react-lite";
import { lineDataItem } from "react-native-gifted-charts";
import { weatherUtils } from "@/utils";
import ThemedView from "../ThemedView";
import ThemedText from "../ThemedText";
import { ScrollView } from "react-native-gesture-handler";
import weatherIcon from "@/config/weatherIcon";
import { Image } from "expo-image";
import { Daily } from "@/type";
import TemperatureChart from "./TemperatureChart";
import { useStores } from "@/hooks";

interface WeatherDailyProps {
  item: Daily;
  index: number;
  width: number;
}

interface ListDailyProps {
  daily: Daily[];
}
const ListDaily = observer(({ daily }: ListDailyProps) => {
  const weatherItemWidth = 90;
  const { weatherStore } = useStores();
  const { tempMaxData, tempMinData } = useMemo(() => {
    if (daily.length === 0) {
      return {
        tempMaxData: [],
        tempMinData: [],
      };
    }

    let tempMaxData: lineDataItem[] = [];
    let tempMinData: lineDataItem[] = [];

    if (weatherStore.temperatureUnit === "metric") {
      daily.forEach((item) => {
        const tempMaxValue = Math.round(item.all_day.temperature_max);
        const tempMinValue = Math.round(item.all_day.temperature_min);

        tempMaxData.push({
          value: tempMaxValue,
          dataPointText:
            weatherUtils.formatTemperatureWithoutUnit(tempMaxValue),
        });
        tempMinData.push({
          value: tempMinValue,
          dataPointText:
            weatherUtils.formatTemperatureWithoutUnit(tempMinValue),
        });
      });
    } else {
      daily.forEach((item) => {
        const tempMaxValue = weatherUtils.celsiusToFahrenheit(
          item.all_day.temperature_max
        );
        const tempMinValue = weatherUtils.celsiusToFahrenheit(
          item.all_day.temperature_min
        );

        tempMaxData.push({
          value: tempMaxValue,
          dataPointText:
            weatherUtils.formatTemperatureWithoutUnit(tempMaxValue),
        });
        tempMinData.push({
          value: tempMinValue,
          dataPointText:
            weatherUtils.formatTemperatureWithoutUnit(tempMinValue),
        });
      });
    }

    return {
      tempMaxData,
      tempMinData,
    };
  }, [daily, weatherStore.temperatureUnit]);
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

          <ThemedView paddingTop={24}>
            <TemperatureChart
              data={tempMaxData}
              weatherItemWidth={weatherItemWidth}
            />
          </ThemedView>

          <ThemedView paddingTop={24}>
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
