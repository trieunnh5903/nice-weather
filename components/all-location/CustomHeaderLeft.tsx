import { StyleSheet, View } from "react-native";
import React, { memo } from "react";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useAppTheme, useStores } from "@/hooks";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import RippleButtonIcon from "../RippleButtonIcon";
import ThemedText from "../ThemedText";
import { TouchableOpacity } from "react-native-gesture-handler";

interface CustomHeaderLeftProps {
  handleSelecteAll: () => void;
  selectedItems: string[];
  progress: SharedValue<number>;
}

const CustomHeaderLeft = memo(function CustomHeaderLeft({
  handleSelecteAll,
  selectedItems,
  progress,
}: CustomHeaderLeftProps) {
  const themeColor = useAppTheme();
  const radioButtonColor = themeColor.primary;
  const { weatherStore } = useStores();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: interpolate(progress.value, [0, 1], [-200, 0]) },
      ],
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 0.1], [1, 0]),
    };
  });

  const onBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={styles.rowCenter}>
      <Animated.View style={[styles.rowCenter, backAnimatedStyle]}>
        <RippleButtonIcon onPress={onBackPress}>
          <MaterialIcons name="arrow-back" size={24} color={radioButtonColor} />
        </RippleButtonIcon>
        <ThemedText type="title">Location</ThemedText>
      </Animated.View>
      <Animated.View style={[{ position: "absolute" }, animatedStyle]}>
        <TouchableOpacity
          onPress={handleSelecteAll}
          style={styles.selectedAllWrapper}
        >
          <MaterialIcons
            name={
              selectedItems.length === weatherStore.places.length
                ? "check-circle"
                : "radio-button-unchecked"
            }
            size={24}
            color={radioButtonColor}
          />

          <ThemedText type="defaultBold" color={radioButtonColor}>
            Selected All
          </ThemedText>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
});

export default CustomHeaderLeft;

const styles = StyleSheet.create({
  selectedAllWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
