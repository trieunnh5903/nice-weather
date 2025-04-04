import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import React, { memo, useCallback } from "react";
import { FlatList } from "react-native-gesture-handler";
import { Divider } from "react-native-paper";
import { Place } from "@/type";
import Animated, {
  AnimatedStyle,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { observer } from "mobx-react-lite";
import { useAppTheme, useLanguage, useStores } from "@/hooks";
import { useQueries } from "@tanstack/react-query";
import { router } from "expo-router";
import { placeUtils, weatherUtils } from "@/utils";
import ThemedView from "../ThemedView";
import { MaterialIcons } from "@expo/vector-icons";
import ThemedText from "../ThemedText";
import { queryConfig } from "@/config/queryConfig";

interface WeatherItemProps {
  place: Place;
  index: number;
  selectedItems: string[];
  onLocationPress: (index: number, id: string) => void;
  animatedStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  temperature: string | undefined;
}

interface LocationListProps {
  multipleDelete: boolean;
  selectedItems: string[];
  handleSelectItem: (id: string) => void;
  progress: SharedValue<number>;
}

const LocationList = observer(
  ({
    multipleDelete,
    selectedItems,
    handleSelectItem,
    progress,
  }: LocationListProps) => {
    const { weatherStore } = useStores();
    console.log("LocationList");
    const { currentLanguage } = useLanguage();
    const allWeather = useQueries({
      queries: weatherStore.places.map((place) =>
        queryConfig.currentWeatherQueryOptions(
          place.lat,
          place.lon,
          currentLanguage
        )
      ),
    });

    const onLocationPress = useCallback(
      (index: number, id: string) => {
        if (multipleDelete) {
          handleSelectItem(id);
          return;
        }

        weatherStore.setSelectedIndex(index);
        router.back();
      },
      [handleSelectItem, multipleDelete, weatherStore]
    );
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: interpolate(progress.value, [0, 1], [-42, 0]) },
        ],
      };
    });

    return (
      <FlatList
        data={weatherStore.places}
        keyExtractor={(item) => item.place_id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item, index }) => {
          const current = allWeather[index].data?.current;
          const formatTemp = current
            ? weatherStore.temperatureUnit === "metric"
              ? weatherUtils.formatCelsius(current.temp_c)
              : weatherUtils.formatFahrenheit(current.temp_f)
            : undefined;
          return (
            <WeatherItem
              temperature={formatTemp}
              animatedStyle={animatedStyle}
              onLocationPress={onLocationPress}
              place={item}
              index={index}
              selectedItems={selectedItems}
            />
          );
        }}
      />
    );
  }
);

const WeatherItem = memo(function WeatherItem({
  place,
  index,
  selectedItems,
  animatedStyle,
  onLocationPress,
  temperature,
}: WeatherItemProps) {
  const themeColor = useAppTheme();
  const rippleColor = themeColor.ripple;
  const iconColor = themeColor.icon;
  return (
    <Pressable
      onPress={() => onLocationPress(index, place.place_id)}
      android_ripple={{
        color: rippleColor,
        foreground: true,
      }}
    >
      <ThemedView style={styles.weather}>
        <Animated.View
          style={[styles.rowCenter, { gap: 18, flex: 1 }, animatedStyle]}
        >
          <MaterialIcons
            name={
              selectedItems.includes(place.place_id)
                ? "check-circle"
                : "radio-button-unchecked"
            }
            size={24}
            color={iconColor}
          />

          <ThemedView flex>
            <ThemedView style={styles.nameWrapper}>
              {place.isUserLocation && (
                <MaterialIcons name="location-on" size={24} color={iconColor} />
              )}
              <ThemedText>{place.name}</ThemedText>
            </ThemedView>

            <ThemedText numberOfLines={1}>
              {placeUtils.getAddress(place)}
            </ThemedText>
          </ThemedView>
        </Animated.View>
        {temperature && (
          <ThemedView>
            <ThemedText fontSize={18}>{temperature}</ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </Pressable>
  );
});

export default LocationList;

const styles = StyleSheet.create({
  weather: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    // backgroundColor: 'red'
  },
  nameWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
