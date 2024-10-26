import { ActivityIndicator, StyleSheet } from "react-native";
import React, { memo, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import ThemedView from "../ThemedView";
import ThemedText from "../ThemedText";
import { Size } from "@/constants/size";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { useAppTheme, useLanguage, useStores } from "@/hooks";
import { weatherUtils } from "@/utils";
import { CurrentWeather } from "@/type";
import { useTranslation } from "react-i18next";
import { QUERY_KEY } from "@/constants/queryKey";

interface CurrentWeatherInfoProps {
  currentWeather: CurrentWeather;
  onSwipe: (translationX: number) => void;
  updatedAt: number;
}

const CurrentWeatherInfo: React.FC<CurrentWeatherInfoProps> = observer(
  ({ currentWeather, onSwipe, updatedAt }) => {
    const themeColor = useAppTheme();
    const { t } = useTranslation();
    const iconColor = themeColor.icon;
    const { weatherStore } = useStores();
    const pan = useMemo(
      () =>
        Gesture.Pan()
          .onEnd((event) => {
            if (Math.abs(event.translationX) > Math.abs(event.translationY)) {
              onSwipe(event.translationX);
            }
          })
          .activeOffsetX([-50, 50])
          .runOnJS(true),
      [onSwipe]
    );

    const temperature = useMemo(
      () =>
        weatherStore.temperatureUnit === "metric"
          ? weatherUtils.formatCelcius(currentWeather.temp_c)
          : weatherUtils.formatFahrenheit(currentWeather.temp_f),
      [
        currentWeather.temp_c,
        currentWeather.temp_f,
        weatherStore.temperatureUnit,
      ]
    );

    const feelLikeTemp = useMemo(
      () =>
        weatherStore.temperatureUnit === "metric"
          ? weatherUtils.formatCelcius(currentWeather.feelslike_c)
          : weatherUtils.formatFahrenheit(currentWeather.feelslike_f),
      [
        currentWeather.feelslike_c,
        currentWeather.feelslike_f,
        weatherStore.temperatureUnit,
      ]
    );
    const feelLike =
      t("home.feature.curren_weather.feel_like") + " " + feelLikeTemp;

    return (
      <GestureDetector gesture={pan}>
        <ThemedView style={[styles.current]}>
          <ThemedText style={styles.celcius}>{temperature}</ThemedText>
          <ThemedText color={iconColor}>
            {currentWeather.condition.text}
          </ThemedText>
          <ThemedText color={iconColor}>{feelLike}</ThemedText>
          <DataStatus dataUpdatedAt={updatedAt} />
        </ThemedView>
      </GestureDetector>
    );
  }
);

const DataStatus = ({ dataUpdatedAt }: { dataUpdatedAt: number }) => {
  const { t } = useTranslation();
  const isFetching = useIsFetching();
  const themeColor = useAppTheme();
  const date = new Date(dataUpdatedAt).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (isFetching)
    return (
      <ThemedView style={styles.row}>
        <ActivityIndicator size={12} color={themeColor.primary} />
        <ThemedView paddingLeft={6}>
          <ThemedText type="label">
            {t("home.feature.data_status.updating")}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );

  return (
    <ThemedText type="label">
      {t("home.feature.data_status.updated_at") + " " + date}
    </ThemedText>
  );
};

export default memo(CurrentWeatherInfo);

const styles = StyleSheet.create({
  current: {
    alignItems: "center",
    marginTop: 6,
    width: Size.screenWidth,
  },
  celcius: {
    fontSize: 70,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
