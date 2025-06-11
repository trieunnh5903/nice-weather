import { StyleSheet } from "react-native";
import React, { memo, useMemo } from "react";
import { lineDataItem } from "react-native-gifted-charts";
import { weatherUtils } from "@/utils";
import ThemedView from "../ThemedView";
import ThemedText from "../ThemedText";
import { ScrollView } from "react-native-gesture-handler";
import weatherIcon from "@/config/weatherIcon";
import { Image } from "expo-image";
import TemperatureChart from "./TemperatureChart";
import { useTranslation } from "react-i18next";
import { Daily } from "@/types/weather/forecast";
import { TemperatureUnit } from "@/types/common/unit";

interface WeatherDailyProps {
  item: Daily;
  index: number;
  width: number;
}

interface ListDailyProps {
  daily: Daily[];
  temperatureUnit: TemperatureUnit;
}
const ListDaily: React.FC<ListDailyProps> = ({ daily, temperatureUnit }) => {
  
  const weatherItemWidth = 90;
  const { t } = useTranslation();
  const { tempMaxData, tempMinData } = useMemo(() => {
    if (daily.length === 0) {
      return {
        tempMaxData: [],
        tempMinData: [],
      };
    }

    let tempMaxData: lineDataItem[] = [];
    let tempMinData: lineDataItem[] = [];

    if (temperatureUnit === "metric") {
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
  }, [daily, temperatureUnit]);
  if (daily.length === 0) return null;
  return (
    <ThemedView>
      <ThemedView paddingHorizontal={12}>
        <ThemedText uppercase type="subtitle">
          {t("home.feature.daily.title")}
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
};

const WeatherDaily: React.FC<WeatherDailyProps> = React.memo(
  function WeatherDaily({ index, item, width }) {
    const { t } = useTranslation();
    const icon = item.icon as keyof typeof weatherIcon;
    const day = weatherUtils.getDay(item.day);
    const tag =
      index === 0
        ? t("home.feature.daily.today")
        : day === weatherUtils.days[1]
        ? t("home.feature.daily.next_week")
        : "";

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
                {item.all_day.cloud_cover.total + t("unit.%")}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    );
  }
);

export default memo(ListDaily);

const styles = StyleSheet.create({
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
  },
});
