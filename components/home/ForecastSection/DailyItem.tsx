import weatherIcon from "@/config/weatherIcon";
import { weatherUtils } from "@/utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Daily } from "@/types/weather/forecast";
import { ThemedText, ThemedView } from "@/components/common/Themed";

interface DailyItemProps {
  item: Daily;
  index: number;
  width: number;
}
export const DailyItem: React.FC<DailyItemProps> = React.memo(function DailyItem({
  index,
  item,
  width,
}) {
  const { t } = useTranslation();
  const icon = (item.icon as keyof typeof weatherIcon) || 1;
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
});
const styles = StyleSheet.create({
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
  },
});
