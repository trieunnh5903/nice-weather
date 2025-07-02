import { StyleSheet } from "react-native";
import React, { memo } from "react";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import ThemedView from "../common/Themed/ThemedView";
import ThemedText from "../common/Themed/ThemedText";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { MaterialIconName } from "@/types/common/materialIcon";
import RippleButtonIcon from "../common/Button/RippleButtonIcon";
import { useAppTheme } from "@/hooks/common";

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
  const { t } = useTranslation();
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
        <ThemedText>
          {numberOfSelected} {t("all_location.selected")}
        </ThemedText>
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
