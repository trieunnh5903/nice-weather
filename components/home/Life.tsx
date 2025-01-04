import { StyleSheet } from "react-native";
import React, { memo, PropsWithChildren } from "react";
import AstronomyDetail from "./AstronomyDetail";
import ThemedText from "../ThemedText";
import ThemedView from "../ThemedView";
import { Size } from "@/constants/Size";
import { Astronomy, CurrentWeather } from "@/type";
import { useAppTheme } from "@/hooks";
import { useTranslation } from "react-i18next";

interface LifeProps {
  current: CurrentWeather;
  astronomy: Astronomy[];
}

const getUVIndexDescription = (uvIndex: number) => {
  if (uvIndex <= 2) return "low";
  if (uvIndex <= 5) return "moderate";
  if (uvIndex <= 7) return "high";
  if (uvIndex <= 10) return "very_high";
  return "extreme";
};

const Title = ({ children }: PropsWithChildren) => {
  return (
    <ThemedText fontSize={14} style={{ textAlign: "center" }}>
      {children}
    </ThemedText>
  );
};

const Subtitle = ({ children }: PropsWithChildren) => {
  return (
    <ThemedText fontSize={13} style={{ textAlign: "center" }}>
      {children}
    </ThemedText>
  );
};
const Life: React.FC<LifeProps> = ({ astronomy, current }) => {
  const appTheme = useAppTheme();
  const { t } = useTranslation();
  const uvDescriptionKey = getUVIndexDescription(current.uv);
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
            <Title>{t("home.feature.life.wind.title")}</Title>
            <Subtitle>
              {t(
                `home.feature.life.wind.wind_direction.${current.wind_dir}` as any
              )}
            </Subtitle>
            <Subtitle>
              {current.wind_kph} {t("unit.km/h")}
            </Subtitle>
          </ThemedView>
          <ThemedView
            style={[
              styles.centered,
              styles.lifeItem,
              { borderRightWidth: 0, borderColor: appTheme.border },
            ]}
          >
            <Title> {t("home.feature.life.uv.title")}</Title>
            <Subtitle>{t(`home.feature.life.uv.${uvDescriptionKey}`)}</Subtitle>
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
            <Title>{t("home.feature.life.air_quatity.title")}</Title>
            <Subtitle>
              {t(
                `home.feature.life.air_quatity.${current.air_quality["us-epa-index"]}` as any,
                {
                  defaultValue: current.air_quality["us-epa-index"],
                }
              )}
            </Subtitle>
          </ThemedView>
          <ThemedView
            style={[
              styles.centered,
              styles.lifeItem,
              { borderRightWidth: 0, borderColor: appTheme.border },
            ]}
          >
            <Title>{t("home.feature.life.humidity")}</Title>
            <Subtitle>
              {current.humidity}
              {t("unit.%")}
            </Subtitle>
          </ThemedView>
        </ThemedView>
      </ThemedView>
      <AstronomyDetail astronomy={astronomy} />
    </ThemedView>
  );
};

export default memo(Life);

const styles = StyleSheet.create({
  lifeRow: { flexDirection: "row", flexWrap: "wrap" },

  lifeItem: {
    flex: 1,
    borderWidth: 0.5,
    height: Size.screenWidth * 0.2,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
});
