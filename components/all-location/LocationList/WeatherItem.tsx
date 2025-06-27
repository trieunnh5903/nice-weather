import { ThemedText, ThemedView } from "@/components/common/Themed";
import { useAppTheme } from "@/hooks/common";
import { Place } from "@/types/weather/place";
import { placeUtils } from "@/utils";
import { MaterialIcons } from "@expo/vector-icons";
import { memo } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

interface WeatherItemProps {
  place: Place;
  index: number;
  selectedItems: string[];
  onLocationPress: (index: number, id: string) => void;
  temperature: string | undefined;
  progress: SharedValue<number>;
}

export const WeatherItem = memo(function WeatherItem({
  place,
  index,
  selectedItems,
  onLocationPress,
  progress,
  temperature,
}: WeatherItemProps) {
  const themeColor = useAppTheme();
  const rippleColor = themeColor.ripple;
  const iconColor = themeColor.icon;
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: interpolate(progress.value, [0, 1], [-42, 0]) },
      ],
    };
  });

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
