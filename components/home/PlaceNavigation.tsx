import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
import ThemedView from "../common/Themed/ThemedView";
import ThemedText from "../common/Themed/ThemedText";
import { NavigationButton } from "./NavigationButton";
import { Size } from "@/constants/size";
import { CurrentWeatherResponse } from "@/types/weather/currenWeather";
import { getTemperatureText } from "@/utils/weatherUtils";
import { useSelectedPlaceWeather } from "@/hooks/weather";
import { useAppTheme, useStores } from "@/hooks/common";
import { Observer } from "mobx-react-lite";

interface PlaceNavigationProps {
  onLeftPress: () => void;
  onRightPress: () => void;
  progress: SharedValue<number>;
  maxScrollAnimatedOffset: number;
  testID?: React.ComponentProps<typeof View>["testID"];
}

const BUTTON_WIDTH = 44;

const PlaceNavigation: React.FC<PlaceNavigationProps> = ({
  onLeftPress,
  onRightPress,
  progress,
  maxScrollAnimatedOffset,
  testID,
}) => {
  const { currentWeather, isSuccess } = useSelectedPlaceWeather();

  const placeNameAnimatedStyle = useAnimatedStyle(() => ({
    flex: interpolate(
      progress.value,
      [0, maxScrollAnimatedOffset],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));
  return (
    <ThemedView testID={testID} style={styles.navigationWrapper}>
      <ThemedView style={styles.button}>
        <NavigationButton icon="chevron-left" onPress={onLeftPress} />
      </ThemedView>

      <ThemedView style={styles.locationWrapper}>
        <Address progress={progress} />
        <Animated.View style={placeNameAnimatedStyle} />

        <Condition
          progress={progress}
          maxScrollAnimatedOffset={maxScrollAnimatedOffset}
          currentWeather={currentWeather}
        />

        <Temperature
          progress={progress}
          maxScrollAnimatedOffset={maxScrollAnimatedOffset}
          currentWeather={currentWeather}
          isSuccess={isSuccess}
        />

        <NumOfPlaces progress={progress} />
      </ThemedView>

      <ThemedView style={styles.button}>
        <NavigationButton icon="chevron-right" onPress={onRightPress} />
      </ThemedView>
    </ThemedView>
  );
};

const Address: React.FC<Pick<PlaceNavigationProps, "progress">> = ({
  progress,
}) => {
  const { weatherStore } = useStores();
  const themeColor = useAppTheme();
  const locationOnAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 10], [1, 0], Extrapolation.CLAMP),
    width: interpolate(progress.value, [0, 10], [16, 0], Extrapolation.CLAMP),
  }));

  return (
    <ThemedView>
      <ThemedView style={styles.namePlaceContainer}>
        {weatherStore.selectedPlace.isUserLocation && (
          <Animated.View style={locationOnAnimatedStyle}>
            <MaterialIcons
              name="location-on"
              size={16}
              color={themeColor.icon}
            />
          </Animated.View>
        )}
        <ThemedText type="defaultMedium" fontSize={17} color={themeColor.icon}>
          {weatherStore.selectedPlace.name}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

const Condition: React.FC<
  Pick<PlaceNavigationProps, "maxScrollAnimatedOffset" | "progress"> & {
    currentWeather: CurrentWeatherResponse | undefined;
  }
> = memo(({ maxScrollAnimatedOffset, progress, currentWeather }) => {
  const conditionTextAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [50, 100],
      [0, 1],
      Extrapolation.CLAMP
    ),
    translateX: interpolate(
      progress.value,
      [0, maxScrollAnimatedOffset],
      [0, -(Size.screenWidth / 2 - BUTTON_WIDTH)],
      Extrapolation.CLAMP
    ),
  }));
  return (
    <Animated.View style={[styles.conditionText, conditionTextAnimatedStyle]}>
      <ThemedText>{currentWeather?.current.condition.text}</ThemedText>
    </Animated.View>
  );
});
Condition.displayName = "Condition";

const Temperature: React.FC<
  Pick<PlaceNavigationProps, "maxScrollAnimatedOffset" | "progress"> & {
    currentWeather: CurrentWeatherResponse | undefined;
    isSuccess: boolean;
  }
> = memo(({ maxScrollAnimatedOffset, progress, currentWeather, isSuccess }) => {
  const { weatherStore } = useStores();
  const temperature = getTemperatureText(
    currentWeather?.current.temp_c,
    currentWeather?.current.temp_f,
    weatherStore.temperatureUnit
  );

  const temperatureAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [50, 100],
      [0, 1],
      Extrapolation.CLAMP
    ),
    translateX: interpolate(
      progress.value,
      [0, maxScrollAnimatedOffset],
      [0, Size.screenWidth / 2 - BUTTON_WIDTH],
      Extrapolation.CLAMP
    ),
  }));
  return (
    <Animated.View style={[styles.temperature, temperatureAnimatedStyle]}>
      <ThemedText fontSize={30}>{temperature}</ThemedText>
    </Animated.View>
  );
});
Temperature.displayName = "Temperature";

const NumOfPlaces: React.FC<{ progress: SharedValue<number> }> = ({
  progress,
}) => {
  const { weatherStore } = useStores();
  console.log("NumOfPlaces render", weatherStore.selectedIndex);

  const numOfPlaceAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 50], [1, 0], Extrapolation.CLAMP),
  }));
  const themeColor = useAppTheme();

  return (
    <Animated.View style={[styles.numOfPlaces, numOfPlaceAnimatedStyle]}>
      {/* <Observer>
        {() => (
          <ThemedText color={themeColor.icon}>{`${
            weatherStore.selectedIndex + 1
          }/${weatherStore.places.length}`}</ThemedText>
        )}
      </Observer> */}
      <ThemedText color={themeColor.icon}>{`${weatherStore.selectedIndex + 1}/${
        weatherStore.places.length
      }`}</ThemedText>
    </Animated.View>
  );
};

export default memo(PlaceNavigation);

const styles = StyleSheet.create({
  namePlaceContainer: { flexDirection: "row", alignItems: "center" },
  numOfPlaces: { position: "absolute", top: "50%" },
  button: {
    width: BUTTON_WIDTH,
  },
  navigationWrapper: {
    flexDirection: "row",
    width: "100%",
    height: 50,
  },
  locationWrapper: {
    justifyContent: "center",
    flex: 1,
    height: "100%",
    flexDirection: "row",
  },
  conditionText: {
    position: "absolute",
    bottom: 0,
    left: Size.screenWidth / 2 - BUTTON_WIDTH,
  },
  temperature: {
    position: "absolute",
    right: Size.screenWidth / 2 - BUTTON_WIDTH,
  },
});
