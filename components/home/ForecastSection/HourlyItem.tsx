import weatherIcon from "@/config/weatherIcon";
import { Hourly } from "@/types/weather/forecast";
import React from "react";
import { useTranslation } from "react-i18next";

import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import { ThemedText, ThemedView } from "@/components/common/Themed";

interface HourlyItemProps {
  item: Hourly;
  index: number;
  width: number;
  nextDayIndex: number;
}

export const HourlyItem: React.FC<HourlyItemProps> = React.memo(
  function HourlyItem({ item, index, width, nextDayIndex }) {
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

const styles = StyleSheet.create({
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
});
