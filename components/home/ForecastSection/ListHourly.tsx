import { StyleSheet } from "react-native";
import React, { memo, useRef } from "react";
import ThemedView from "../../common/Themed/ThemedView";
import ThemedText from "../../common/Themed/ThemedText";
import { ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { Hourly } from "@/types/weather/forecast";
import { TemperatureUnit } from "@/types/common/unit";
import { HourlyItem } from "./HourlyItem";
import TemperatureChart from "./TemperatureChart";
import { useHourlyData } from "@/hooks/weather";

interface ListHourlyProps {
  hourly: Hourly[];
  temperatureUnit: TemperatureUnit;
}

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
                <HourlyItem
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
