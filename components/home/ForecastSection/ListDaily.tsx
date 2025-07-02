import { StyleSheet } from "react-native";
import React, { memo, useMemo } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { Daily } from "@/types/weather/forecast";
import { TemperatureUnit } from "@/types/common/unit";
import { formatDailyChartData } from "@/utils/weatherUtils";
import { DailyItem } from "./DailyItem";
import ThemedView from "@/components/common/Themed/ThemedView";
import ThemedText from "@/components/common/Themed/ThemedText";
import TemperatureChart from "./TemperatureChart";

interface ListDailyProps {
  daily: Daily[];
  temperatureUnit: TemperatureUnit;
}

const ListDaily: React.FC<ListDailyProps> = ({ daily, temperatureUnit }) => {
  const weatherItemWidth = 90;
  const { t } = useTranslation();
  const { tempMaxData, tempMinData } = useMemo(() => {
    return formatDailyChartData(daily, temperatureUnit);
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
                <DailyItem
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
