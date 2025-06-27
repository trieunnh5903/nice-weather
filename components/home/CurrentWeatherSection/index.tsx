import { StyleSheet } from "react-native";
import React, { memo, useMemo } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import ThemedView from "../../common/Themed/ThemedView";
import { Size } from "@/constants/size";
import { TemperatureUnit } from "@/types/common/unit";
import { CurrentWeather } from "@/types/weather/currenWeather";
import { Temperature } from "./Temperature";
import { WeatherCondition } from "./WeatherCondition";
import { RealFeel } from "./RealFeel";
import { FetchStatus } from "./FetchStatus";

interface CurrentWeatherSectionProps {
  onSwipe: (velocityX: number) => void;
  temperatureUnit: TemperatureUnit;
  dataUpdatedAt: number;
  currentWeather: CurrentWeather;
}

const CurrentWeatherSection: React.FC<CurrentWeatherSectionProps> = ({
  onSwipe,
  temperatureUnit,
  currentWeather,
  dataUpdatedAt,
}) => {
  const pan = useMemo(
    () =>
      Gesture.Pan()
        .onEnd((event) => {
          if (Math.abs(event.translationX) > Math.abs(event.translationY)) {
            onSwipe(event?.velocityX);
          }
        })
        .activeOffsetX([-50, 50])
        .runOnJS(true),
    [onSwipe]
  );
  const {
    temp_c,
    temp_f,
    feelslike_c,
    feelslike_f,
    condition: { text: conditionText },
  } = currentWeather;
  return (
    <ThemedView paddingBottom={18}>
      <GestureDetector gesture={pan}>
        <ThemedView style={[styles.current]}>
          <Temperature
            temp_c={temp_c}
            temp_f={temp_f}
            temperatureUnit={temperatureUnit}
          />
          <WeatherCondition conditionText={conditionText} />
          <RealFeel
            feelslike_c={feelslike_c}
            feelslike_f={feelslike_f}
            temperatureUnit={temperatureUnit}
          />
          <FetchStatus dataUpdatedAt={dataUpdatedAt} />
        </ThemedView>
      </GestureDetector>
    </ThemedView>
  );
};

export default memo(CurrentWeatherSection);

const styles = StyleSheet.create({
  current: {
    alignItems: "center",
    marginTop: 6,
    width: Size.screenWidth,
  },
  celsius: {
    fontSize: 70,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
