import { StyleSheet } from "react-native";
import React, { memo } from "react";
import ThemedText from "../../common/Themed/ThemedText";
import ThemedView from "../../common/Themed/ThemedView";
import { Size } from "@/constants/size";
import { useTranslation } from "react-i18next";
import { CurrentWeather } from "@/types/weather/currenWeather";
import { Astronomy } from "@/types/weather/astronomy";
import { getUVIndexDescription } from "@/utils/weatherUtils";
import AstronomyDetail from "./AstronomyDetail";
import { LifeItem } from "./LifeItem";

interface LifeSectionProps {
  current: CurrentWeather;
  astronomy: Astronomy[];
}

const LifeSection: React.FC<LifeSectionProps> = ({ astronomy, current }) => {
  const { t } = useTranslation();
  const uvDescriptionKey = getUVIndexDescription(current.uv);
  const windDirection = t(
    `home.feature.life.wind.wind_direction.${current.wind_dir}` as any
  );
  const airQuality = t(
    `home.feature.life.air_quatity.${current.air_quality["us-epa-index"]}` as any,
    { defaultValue: current.air_quality["us-epa-index"] }
  );
  return (
    <ThemedView paddingTop={12} paddingHorizontal={12}>
      <ThemedText uppercase type="subtitle">
        {t("home.feature.life.title")}
      </ThemedText>

      <ThemedView paddingTop={6} paddingBottom={12}>
        <ThemedView style={styles.lifeRow}>
          <LifeItem
            title={t("home.feature.life.wind.title")}
            values={[windDirection, `${current.wind_kph} ${t("unit.km/h")}`]}
            borderLeft={false}
          />
          <LifeItem
            title={t("home.feature.life.uv.title")}
            values={[t(`home.feature.life.uv.${uvDescriptionKey}`)]}
            borderRight={false}
          />
        </ThemedView>

        <ThemedView style={styles.lifeRow}>
          <LifeItem
            title={t("home.feature.life.air_quatity.title")}
            values={[airQuality]}
            borderLeft={false}
          />
          <LifeItem
            title={t("home.feature.life.humidity")}
            values={[`${current.humidity}${t("unit.%")}`]}
            borderRight={false}
          />
        </ThemedView>
      </ThemedView>

      <AstronomyDetail astronomy={astronomy} />
    </ThemedView>
  );
};

export default memo(LifeSection);

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
