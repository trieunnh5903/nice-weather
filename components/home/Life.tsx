import { StyleSheet } from "react-native";
import React from "react";
import AstronomyDetail from "./AstronomyDetail";
import ThemedText from "../ThemedText";
import ThemedView from "../ThemedView";
import { Size } from "@/constants/size";
import { Astronomy, CurrentWeather } from "@/type";
import { useAppTheme } from "@/hooks";
import { useTranslation } from "react-i18next";

interface LifeProps {
  current: CurrentWeather;
  astronomy: Astronomy[];
}
const Life: React.FC<LifeProps> = ({ astronomy, current }) => {
  const appTheme = useAppTheme();
  const { t } = useTranslation();
  return (
    <ThemedView>
      <ThemedText uppercase type="subtitle">
        {t("home.feature.life.title")}
      </ThemedText>
      <ThemedView paddingTop={6} paddingBottom={12}>
        <ThemedView style={styles.lifeRow}>
          <ThemedView
            style={[
              styles.centered,
              styles.lifeItem,
              { borderLeftWidth: 0, borderColor: appTheme.border },
            ]}
          >
            <ThemedText> {t("home.feature.life.wind")}</ThemedText>
            <ThemedText>{current.wind_dir}</ThemedText>
            <ThemedText>
              {current.wind_kph} {t("unit.km/h")}
            </ThemedText>
          </ThemedView>
          <ThemedView
            style={[
              styles.centered,
              styles.lifeItem,
              { borderRightWidth: 0, borderColor: appTheme.border },
            ]}
          >
            <ThemedText>{t("home.feature.life.uv")}</ThemedText>
            <ThemedText>{current.uv}</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.lifeRow}>
          <ThemedView
            style={[
              styles.centered,
              styles.lifeItem,
              { borderLeftWidth: 0, borderColor: appTheme.border },
            ]}
          >
            <ThemedText>{t("home.feature.life.air_quatity")}</ThemedText>
            <ThemedText>{current.air_quality["us-epa-index"]}</ThemedText>
          </ThemedView>
          <ThemedView
            style={[
              styles.centered,
              styles.lifeItem,
              { borderRightWidth: 0, borderColor: appTheme.border },
            ]}
          >
            <ThemedText>{t("home.feature.life.humidity")}</ThemedText>
            <ThemedText>
              {current.humidity}
              {t("unit.%")}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
      <AstronomyDetail astronomy={astronomy} />
    </ThemedView>
  );
};

export default Life;

const styles = StyleSheet.create({
  lifeRow: { flexDirection: "row", flexWrap: "wrap" },

  lifeItem: {
    flex: 1,
    borderWidth: 0.3,
    height: Size.screenWidth * 0.2,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
});
