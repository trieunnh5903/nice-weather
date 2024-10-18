import { StyleSheet } from "react-native";
import React, { memo } from "react";
import { useAppTheme } from "@/hooks";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import ThemedView from "../ThemedView";
import ThemedText from "../ThemedText";
import { MaterialIconName } from "@/type";
import RippleButtonIcon from "../RippleButtonIcon";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

interface CustomHeaderRightProps {
  icons: MaterialIconName[];
  onHeaderPress: (icon: MaterialIconName) => void;
  numberOfSelected: number;
  progress: SharedValue<number>;
  multipleDelete: boolean;
}

const CustomHeaderRight = memo(function CustomHeaderRight({
  icons,
  onHeaderPress,
  numberOfSelected,
  progress,
  multipleDelete,
}: CustomHeaderRightProps) {
  const themeColor = useAppTheme();
  const selectedAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
    };
  });

  const optionAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 0.1], [1, 0]),
    };
  });

  return (
    <ThemedView style={styles.centered}>
      <Animated.View style={selectedAnimatedStyle}>
        <ThemedText>{numberOfSelected} selected</ThemedText>
      </Animated.View>

      <Animated.View
        pointerEvents={multipleDelete ? "none" : "auto"}
        style={[styles.headerRight, optionAnimatedStyle]}
      >
        {icons.map((icon) => {
          return (
            <RippleButtonIcon
              onPress={() => onHeaderPress(icon)}
              key={"all-location-header" + icon}
            >
              <MaterialIcons name={icon} size={24} color={themeColor.primary} />
            </RippleButtonIcon>
          );
        })}
        <MaterialCommunityIcons
          name="dots-vertical"
          size={24}
          color={themeColor.primary}
        />
      </Animated.View>
    </ThemedView>
  );
});

export default CustomHeaderRight;

const styles = StyleSheet.create({
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    position: "absolute",
    right: 0,
  },
});
