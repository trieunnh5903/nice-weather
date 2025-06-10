import React, { memo, useMemo } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import ThemedView from "../ThemedView";
import ThemedText from "../ThemedText";
import { NavigationButton } from "./NavigationButton";
import { useAppTheme, useLanguage, useStores } from "@/hooks";
import { Size } from "@/constants/size";
import { queryConfig } from "@/config/queryConfig";
import { weatherUtils } from "@/utils";

interface PlaceNavigationProps {
  onLeftPress: () => void;
  onRightPress: () => void;
  progress: SharedValue<number>;
  maxScrollAnimatedOffset: number;
}

const BUTTON_WIDTH = 44;

// const usePlaceNavigationAnimations = (
//   progress: SharedValue<number>,
//   maxScrollAnimatedOffset: number
// ) => {
//   const numOfPlaceAnimatedStyle = useAnimatedStyle(() => ({
//     opacity: interpolate(progress.value, [0, 50], [1, 0], Extrapolation.CLAMP),
//   }));

//   const locationOnAnimatedStyle = useAnimatedStyle(() => ({
//     opacity: interpolate(progress.value, [0, 10], [1, 0], Extrapolation.CLAMP),
//     width: interpolate(progress.value, [0, 10], [16, 0], Extrapolation.CLAMP),
//   }));

//   const conditionTextAnimatedStyle = useAnimatedStyle(() => ({
//     opacity: interpolate(
//       progress.value,
//       [50, 100],
//       [0, 1],
//       Extrapolation.CLAMP
//     ),
//     translateX: interpolate(
//       progress.value,
//       [0, maxScrollAnimatedOffset],
//       [0, -(Size.screenWidth / 2 - BUTTON_WIDTH)],
//       Extrapolation.CLAMP
//     ),
//   }));

//   const temperatureAnimatedStyle = useAnimatedStyle(() => ({
//     opacity: interpolate(
//       progress.value,
//       [50, 100],
//       [0, 1],
//       Extrapolation.CLAMP
//     ),
//     translateX: interpolate(
//       progress.value,
//       [0, maxScrollAnimatedOffset],
//       [0, Size.screenWidth / 2 - BUTTON_WIDTH],
//       Extrapolation.CLAMP
//     ),
//   }));

//   const placeNameAnimatedStyle = useAnimatedStyle(() => ({
//     flex: interpolate(
//       progress.value,
//       [0, maxScrollAnimatedOffset],
//       [0, 1],
//       Extrapolation.CLAMP
//     ),
//   }));

//   return {
//     numOfPlaceAnimatedStyle,
//     conditionTextAnimatedStyle,
//     temperatureAnimatedStyle,
//     placeNameAnimatedStyle,
//     locationOnAnimatedStyle,
//   };
// };

const PlaceNavigation: React.FC<PlaceNavigationProps> = ({
  onLeftPress,
  onRightPress,
  progress,
  maxScrollAnimatedOffset,
}) => {
  // const {
  //   conditionTextAnimatedStyle,
  //   locationOnAnimatedStyle,
  //   numOfPlaceAnimatedStyle,
  //   placeNameAnimatedStyle,
  //   temperatureAnimatedStyle,
  // } = usePlaceNavigationAnimations(progress, maxScrollAnimatedOffset);

  // const { weatherStore } = useStores();
  // const themeColor = useAppTheme();
  // const iconColor = themeColor.icon;
  // const { currentLanguage } = useLanguage();

  // const { isSuccess, data } = useQuery(
  //   queryConfig.currentWeatherQueryOptions(
  //     weatherStore.selectedPlace.lat,
  //     weatherStore.selectedPlace.lon,
  //     currentLanguage
  //   )
  // );

  // const temperature = useMemo(() => {
  //   if (!isSuccess || !data) return "";
  //   return weatherStore.temperatureUnit === "metric"
  //     ? weatherUtils.formatCelsius(data.current.temp_c)
  //     : weatherUtils.formatFahrenheit(data.current.temp_f);
  // }, [data, isSuccess, weatherStore.temperatureUnit]);
  const placeNameAnimatedStyle = useAnimatedStyle(() => ({
    flex: interpolate(
      progress.value,
      [0, maxScrollAnimatedOffset],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));
  return (
    <ThemedView style={styles.navigationWrapper}>
      <ThemedView style={styles.button}>
        <NavigationButton icon="chevron-left" onPress={onLeftPress} />
      </ThemedView>
      {/* <Observer>
        {() => ( */}
      <ThemedView style={styles.locationWrapper}>
        {/* <ThemedView>
              <ThemedView style={styles.namePlaceContainer}>
                {weatherStore.selectedPlace.isUserLocation && (
                  <Animated.View style={locationOnAnimatedStyle}>
                    <MaterialIcons
                      name="location-on"
                      size={16}
                      color={iconColor}
                    />
                  </Animated.View>
                )}
                <ThemedText
                  type="defaultMedium"
                  fontSize={17}
                  color={iconColor}
                >
                  {weatherStore.selectedPlace.name}
                </ThemedText>
              </ThemedView>
            </ThemedView> */}
        <Address progress={progress} />
        <Animated.View style={placeNameAnimatedStyle} />
        {/* <Animated.View
              style={[styles.conditionText, conditionTextAnimatedStyle]}
            >
              <ThemedText>{data?.current.condition.text}</ThemedText>
            </Animated.View> */}

        <Condition
          maxScrollAnimatedOffset={maxScrollAnimatedOffset}
          progress={progress}
        />
        {/* <Animated.View
              style={[styles.temperature, temperatureAnimatedStyle]}
            >
              <ThemedText fontSize={30}>{temperature}</ThemedText>
            </Animated.View> */}
        <Temperature
          maxScrollAnimatedOffset={maxScrollAnimatedOffset}
          progress={progress}
        />
        {/* <Animated.View
              style={[styles.numOfPlaces, numOfPlaceAnimatedStyle]}
            >
              <ThemedText color={iconColor}>{`${weatherStore.selectedIndex + 1}/${weatherStore.places.length}`}</ThemedText>
            </Animated.View> */}
        <NumOfPlaces progress={progress} />
      </ThemedView>
      {/* )}
      </Observer> */}
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
  // console.log("address", weatherStore.selectedPlace.name);

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
  Pick<PlaceNavigationProps, "maxScrollAnimatedOffset" | "progress">
> = ({ maxScrollAnimatedOffset, progress }) => {
  const { currentLanguage } = useLanguage();
  const { weatherStore } = useStores();
  const { data } = useQuery(
    queryConfig.currentWeatherQueryOptions(
      weatherStore.selectedPlace.lat,
      weatherStore.selectedPlace.lon,
      currentLanguage
    )
  );

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
      <ThemedText>{data?.current.condition.text}</ThemedText>
    </Animated.View>
  );
};

const Temperature: React.FC<
  Pick<PlaceNavigationProps, "maxScrollAnimatedOffset" | "progress">
> = ({ maxScrollAnimatedOffset, progress }) => {
  const { weatherStore } = useStores();
  const { currentLanguage } = useLanguage();

  const { isSuccess, data } = useQuery(
    queryConfig.currentWeatherQueryOptions(
      weatherStore.selectedPlace.lat,
      weatherStore.selectedPlace.lon,
      currentLanguage
    )
  );

  const temperature = useMemo(() => {
    if (!isSuccess || !data) return "";
    return weatherStore.temperatureUnit === "metric"
      ? weatherUtils.formatCelsius(data.current.temp_c)
      : weatherUtils.formatFahrenheit(data.current.temp_f);
  }, [data, isSuccess, weatherStore.temperatureUnit]);

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
};

const NumOfPlaces: React.FC<{ progress: SharedValue<number> }> = ({
  progress,
}) => {
  const { weatherStore } = useStores();
  const numOfPlaceAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 50], [1, 0], Extrapolation.CLAMP),
  }));
  const themeColor = useAppTheme();

  return (
    <Animated.View style={[styles.numOfPlaces, numOfPlaceAnimatedStyle]}>
      {/* <Observer>
        {() => ( */}
      <ThemedText color={themeColor.icon}>{`${weatherStore.selectedIndex + 1}/${
        weatherStore.places.length
      }`}</ThemedText>
      {/* )}
      </Observer> */}
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
