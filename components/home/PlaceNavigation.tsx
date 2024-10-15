import { StyleSheet } from "react-native";
import React, { memo, useCallback } from "react";
import ThemedView from "../ThemedView";
import RippleButtonIcon from "../RippleButtonIcon";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { Observer } from "mobx-react-lite";
import ThemedText from "../ThemedText";
import { useAppTheme, useStores } from "@/hooks";

const usePlaceNavigation = () => {
  const { weatherStore } = useStores();

  const onLeftPress = useCallback(() => {
    weatherStore.updateSelectedPlace("decrease");
  }, [weatherStore]);

  const onRightPress = useCallback(() => {
    weatherStore.updateSelectedPlace("increase");
  }, [weatherStore]);

  return {
    onLeftPress,
    onRightPress,
  };
};

const PlaceNavigation = () => {
  const { onLeftPress, onRightPress } = usePlaceNavigation();
  const { weatherStore } = useStores();
  const themeColor = useAppTheme();
  const iconColor = themeColor.icon;

  console.log("PlaceNavigation");

  return (
    <ThemedView style={styles.navigationWrapper}>
      <ThemedView>
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
                <MaterialIcons name="location-on" size={16} color={iconColor} />
              )}
              <ThemedText color={iconColor}>
                {weatherStore.selectedPlace.name}
              </ThemedText>
            </ThemedView>
            <ThemedText color={iconColor}>{`${weatherStore.selectedIndex + 1}/${
              weatherStore.places.length
            }`}</ThemedText>
          </ThemedView>
        )}
      </Observer>
      <ThemedView>
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
  },
  locationName: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
});
