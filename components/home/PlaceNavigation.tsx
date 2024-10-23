import { StyleSheet } from "react-native";
import React, { memo, useMemo } from "react";
import ThemedView from "../ThemedView";
import RippleButtonIcon from "../RippleButtonIcon";
import { Colors } from "@/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { Observer } from "mobx-react-lite";
import ThemedText from "../ThemedText";
import { useAppTheme, useLanguage, useStores } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { queryConfig } from "@/config/queryConfig";
import { weatherUtils } from "@/utils";
import { Size } from "@/constants/size";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { MaterialIconName } from "@/type";

interface PlaceNavigationProps {
  onLeftPress: () => void;
  onRightPress: () => void;
  progress: SharedValue<number>;
  maxScrollAnimatedOffset: number;
}

const BUTTON_WIDTH = 44;

const usePlaceNavigationAnimations = (
  progress: SharedValue<number>,
  maxScrollAnimatedOffset: number
) => {
  const numOfPlaceAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        progress.value,
        [0, 50],
        [1, 0],
        Extrapolation.CLAMP
      ),
    };
  });

  const locationOnAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value,
      [0, 10],
      [1, 0],
      Extrapolation.CLAMP
    );

    const width = interpolate(
      progress.value,
      [0, 10],
      [16, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      width,
    };
  });

  const conditionTextAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value,
      [50, 100],
      [0, 1],
      Extrapolation.CLAMP
    );

    const translateX = interpolate(
      progress.value,
      [0, maxScrollAnimatedOffset],
      [0, -(Size.screenWidth / 2 - BUTTON_WIDTH)],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      translateX,
    };
  });

  const temperatureAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value,
      [50, 100],
      [0, 1],
      Extrapolation.CLAMP
    );

    const translateX = interpolate(
      progress.value,
      [0, maxScrollAnimatedOffset],
      [0, Size.screenWidth / 2 - BUTTON_WIDTH],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      translateX,
    };
  });

  const placeNameAnimatedStyle = useAnimatedStyle(() => {
    const flex = interpolate(
      progress.value,
      [0, maxScrollAnimatedOffset],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      flex,
    };
  });

  return {
    numOfPlaceAnimatedStyle,
    conditionTextAnimatedStyle,
    temperatureAnimatedStyle,
    placeNameAnimatedStyle,
    locationOnAnimatedStyle,
  };
};

const PlaceNavigation: React.FC<PlaceNavigationProps> = ({
  onLeftPress,
  onRightPress,
  progress,
  maxScrollAnimatedOffset,
}) => {
  const {
    conditionTextAnimatedStyle,
    locationOnAnimatedStyle,
    numOfPlaceAnimatedStyle,
    placeNameAnimatedStyle,
    temperatureAnimatedStyle,
  } = usePlaceNavigationAnimations(progress, maxScrollAnimatedOffset);
  const { weatherStore } = useStores();
  const themeColor = useAppTheme();
  const iconColor = themeColor.icon;
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
      ? weatherUtils.formatCelcius(data.current.temp_c)
      : weatherUtils.formatFahrenheit(data.current.temp_f);
  }, [data, isSuccess, weatherStore.temperatureUnit]);

  return (
    <ThemedView style={styles.navigationWrapper}>
      <NavigationButton icon={"chevron-left"} onPress={onLeftPress} />
      <Observer>
        {() => (
          <ThemedView style={[styles.locationWrapper]}>
            <ThemedView>
              <ThemedView style={styles.namePlaceContainer}>
                {weatherStore.selectedPlace.isUserLocation && (
                  <Animated.View style={[locationOnAnimatedStyle]}>
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
            </ThemedView>

            <Animated.View style={placeNameAnimatedStyle} />
            <Animated.View
              style={[
                {
                  position: "absolute",
                  bottom: 0,
                  left: Size.screenWidth / 2 - BUTTON_WIDTH,
                },
                conditionTextAnimatedStyle,
              ]}
            >
              <ThemedText color={iconColor}>
                {data?.current.condition.text}
              </ThemedText>
            </Animated.View>

            <Animated.View
              style={[
                {
                  position: "absolute",
                  right: Size.screenWidth / 2 - BUTTON_WIDTH,
                },
                temperatureAnimatedStyle,
              ]}
            >
              <ThemedText fontSize={30} color={iconColor}>
                {temperature}
              </ThemedText>
            </Animated.View>

            <Animated.View
              style={[styles.numOfPlaces, numOfPlaceAnimatedStyle]}
            >
              <ThemedText color={iconColor}>{`${
                weatherStore.selectedIndex + 1
              }/${weatherStore.places.length}`}</ThemedText>
            </Animated.View>
          </ThemedView>
        )}
      </Observer>
      <NavigationButton icon={"chevron-right"} onPress={onRightPress} />
    </ThemedView>
  );
};

interface NavigationButtonProps {
  onPress: () => void;
  icon: MaterialIconName;
}
const NavigationButton: React.FC<NavigationButtonProps> = ({
  icon,
  onPress,
}) => {
  const themeColor = useAppTheme();
  return (
    <ThemedView style={styles.button}>
      <RippleButtonIcon rippleColor={Colors.dark.ripple} onPress={onPress}>
        <MaterialIcons name={icon} size={32} color={themeColor.icon} />
      </RippleButtonIcon>
    </ThemedView>
  );
};
export default memo(PlaceNavigation);

const styles = StyleSheet.create({
  namePlaceContainer: { flexDirection: "row", alignItems: "center" },
  numOfPlaces: { position: "absolute", top: "50%" },
  locationOn: { position: "absolute", left: -16 },
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
  locationName: {
    flexDirection: "row",
    gap: 2,
    alignItems: "center",
  },
});
