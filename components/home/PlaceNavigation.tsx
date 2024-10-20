import { StyleSheet } from "react-native";
import React, { memo, useMemo, useState } from "react";
import ThemedView from "../ThemedView";
import RippleButtonIcon from "../RippleButtonIcon";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { Observer } from "mobx-react-lite";
import ThemedText from "../ThemedText";
import { useAppTheme, useStores } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { queryConfig } from "@/config/queryConfig";
import { weatherUtils } from "@/utils";
import { Size } from "@/constants/Size";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

interface PlaceNavigationProps {
  onLeftPress: () => void;
  onRightPress: () => void;
  progress: SharedValue<number>;
}

const BUTTON_WIDTH = 44;
const PlaceNavigation: React.FC<PlaceNavigationProps> = ({
  onLeftPress,
  onRightPress,
  progress,
}) => {
  const [placeTitleWidth, setPlaceTitleWidth] = useState(0);
  const [conditionTextWidth, setConditionTextWidth] = useState(0);
  const [temperatureWidth, setTemperatureWidth] = useState(0);
  const { weatherStore } = useStores();
  const themeColor = useAppTheme();
  const iconColor = themeColor.icon;
  const { isSuccess, data } = useQuery(
    queryConfig.weatherQueryOptions(
      weatherStore.selectedPlace.lat,
      weatherStore.selectedPlace.lon,
      weatherStore.temperatureUnit
    )
  );
  const temperature = useMemo(() => {
    if (!isSuccess) return;
    return weatherStore.temperatureUnit === "metric"
      ? weatherUtils.formatCelcius(data.current.temp_c)
      : weatherUtils.formatFahrenheit(data.current.temp_f);
  }, [data, isSuccess, weatherStore.temperatureUnit]);

  const numOfPlaceAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value,
      [0, 10],
      [1, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity,
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
      [0, 160],
      [0, -(Size.screenWidth - BUTTON_WIDTH * 2 - conditionTextWidth - 16) / 2],
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
      [0, 160],
      [0, (Size.screenWidth - BUTTON_WIDTH * 2 - temperatureWidth - 16) / 2],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      translateX,
    };
  });

  const placeNameAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 160],
      [0, -(Size.screenWidth - BUTTON_WIDTH * 2 - placeTitleWidth - 16) / 2],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateX: translateX }],
    };
  });

  return (
    <ThemedView style={styles.navigationWrapper}>
      <ThemedView style={styles.button}>
        <RippleButtonIcon
          rippleColor={Colors.dark.ripple}
          onPress={onLeftPress}
        >
          <MaterialIcons name="chevron-left" size={32} color={iconColor} />
        </RippleButtonIcon>
      </ThemedView>

      <Observer>
        {() => (
          <ThemedView style={styles.locationWrapper}>
            <ThemedView style={styles.locationName}>
              {weatherStore.selectedPlace.isUserLocation && (
                <Animated.View style={[locationOnAnimatedStyle]}>
                  <MaterialIcons
                    name="location-on"
                    size={16}
                    color={iconColor}
                  />
                </Animated.View>
              )}
              <Animated.View
                onLayout={(event) =>
                  setPlaceTitleWidth(event.nativeEvent.layout.width)
                }
                style={[placeNameAnimatedStyle]}
              >
                <ThemedText
                  type="defaultMedium"
                  fontSize={17}
                  color={iconColor}
                >
                  {weatherStore.selectedPlace.name}
                </ThemedText>
              </Animated.View>
            </ThemedView>
            <Animated.View
              onLayout={(event) =>
                setConditionTextWidth(event.nativeEvent.layout.width)
              }
              style={[
                { position: "absolute", bottom: 2 },
                conditionTextAnimatedStyle,
              ]}
            >
              <ThemedText color={iconColor}>
                {data?.current.condition.text}
              </ThemedText>
            </Animated.View>

            <Animated.View
              onLayout={(event) =>
                setTemperatureWidth(event.nativeEvent.layout.width)
              }
              style={[{ position: "absolute" }, temperatureAnimatedStyle]}
            >
              <ThemedText fontSize={30} color={iconColor}>
                {temperature}
              </ThemedText>
            </Animated.View>

            <Animated.View style={numOfPlaceAnimatedStyle}>
              <ThemedText color={iconColor}>{`${
                weatherStore.selectedIndex + 1
              }/${weatherStore.places.length}`}</ThemedText>
            </Animated.View>
          </ThemedView>
        )}
      </Observer>

      <ThemedView style={styles.button}>
        <RippleButtonIcon
          rippleColor={Colors.dark.ripple}
          onPress={onRightPress}
        >
          <MaterialIcons name="chevron-right" size={32} color={iconColor} />
        </RippleButtonIcon>
      </ThemedView>
    </ThemedView>
  );
};

export default memo(PlaceNavigation);

const styles = StyleSheet.create({
  locationOn: { position: "absolute", left: -16 },
  button: {
    width: BUTTON_WIDTH,
  },
  navigationWrapper: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
  },
  locationWrapper: {
    alignItems: "center",
    flex: 1,
    height: "100%",
  },
  locationName: {
    flexDirection: "row",
    gap: 2,
    alignItems: "center",
  },
});
