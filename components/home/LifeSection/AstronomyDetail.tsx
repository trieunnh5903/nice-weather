import { StyleSheet } from "react-native";
import React from "react";
import { weatherUtils } from "@/utils";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Astronomy } from "@/types/weather/astronomy";
import SunriseChart from "./SunriseChart";
import { useCurrentTimeInPercent } from "@/hooks/weather/useCurrentTimeInPercent";
import { useAppTheme } from "@/hooks/common";
import { ThemedText, ThemedView } from "@/components/common/Themed";

interface Props {
  astronomy: Astronomy[];
}

const AstronomyDetail: React.FC<Props> = ({ astronomy }) => {
  const themeColor = useAppTheme();
  const iconColor = themeColor.icon;
  const { t } = useTranslation();
  const currentTimeInPercent = useCurrentTimeInPercent(astronomy);

  if (!astronomy || astronomy.length < 2) return null;

  const [today, tomorrow] = astronomy;

  return (
    <ThemedView style={styles.row}>
      {currentTimeInPercent !== null && (
        <ThemedView style={styles.centered}>
          <SunriseChart
            currentTimeInPercent={currentTimeInPercent}
            astronomy={today}
          />
        </ThemedView>
      )}
      <ThemedView
        style={[
          styles.centered,
          styles.gap_6,
          styles.tomorrow,
          { borderColor: themeColor.border },
        ]}
      >
        <ThemedText>{t("home.feature.hourly.tomorrow")}</ThemedText>

        <ThemedView style={[styles.row, styles.centered, styles.gap_6]}>
          <Feather name="sunrise" size={24} color={iconColor} />
          <ThemedText fontSize={13}>
            {weatherUtils.formatSunrise(tomorrow.sunrise)}
          </ThemedText>
        </ThemedView>

        <ThemedView style={[styles.row, styles.centered, styles.gap_6]}>
          <Feather name="sunset" size={24} color={iconColor} />
          <ThemedText fontSize={13}>
            {weatherUtils.formatSunrise(tomorrow.sunset)}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

export default AstronomyDetail;

const styles = StyleSheet.create({
  tomorrow: {
    padding: 6,
    borderLeftWidth: 0.5,
    paddingHorizontal: 16,
  },
  row: { flexDirection: "row", justifyContent: "space-evenly" },
  gap_6: {
    gap: 6,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
});
