import { ActivityIndicator, StyleSheet } from "react-native";
import React, { memo, useCallback, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import ThemedView from "../ThemedView";
import ThemedText from "../ThemedText";
import { Size } from "@/constants/Size";
import { useIsFetching } from "@tanstack/react-query";
import { useAppTheme, useStores, useWeatherSelected } from "@/hooks";
import { weatherUtils } from "@/utils";
import { CurrentWeather, TemperatureUnit } from "@/type";

interface CurrentWeatherInfoProps {
  currentWeather: CurrentWeather;
  onSwipe: (translationX: number) => void;
  units: TemperatureUnit;
}

const DataStatus = () => {
  const isFetching = useIsFetching();
  const themeColor = useAppTheme();
  const date = new Date().toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (isFetching)
    return (
      <ThemedView style={styles.row}>
        <ActivityIndicator size={12} color={themeColor.primary} />
        <ThemedView paddingLeft={6}>
          <ThemedText type="label">Updating...</ThemedText>
        </ThemedView>
      </ThemedView>
    );

  return <ThemedText type="label">Updated at {date}</ThemedText>;
};

const CurrentWeatherInfo: React.FC<CurrentWeatherInfoProps> = observer(
  ({ currentWeather, onSwipe, units }) => {
    const themeColor = useAppTheme();
    const iconColor = themeColor.icon;

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

    const temperature =
      units === "metric"
        ? weatherUtils.formatCelcius(currentWeather.temperature)
        : weatherUtils.formatFahrenheit(currentWeather.temperature);
    const cloudCover = `Cloud cover ${currentWeather.cloud_cover}%`;
    return (
      <GestureDetector gesture={pan}>
        <ThemedView style={styles.current}>
          <ThemedText style={styles.celcius}>{temperature}</ThemedText>
          <ThemedText color={iconColor}>{currentWeather.summary}</ThemedText>
          <ThemedText color={iconColor}>{cloudCover}</ThemedText>
          <DataStatus />
        </ThemedView>
      </GestureDetector>
    );
  }
);

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
