import { StyleSheet, View } from "react-native";
import React, { memo } from "react";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
import ThemedText from "../common/Themed/ThemedText";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { goBack } from "@/utils/navigationUtils";
import { useAppTheme, useStores } from "@/hooks/common";
import { RippleButtonIcon } from "../common/Button";

interface CustomHeaderLeftProps {
  handleSelectedAll: () => void;
  selectedItems: string[];
  progress: SharedValue<number>;
}

const CustomHeaderLeft = memo(function CustomHeaderLeft({
  handleSelectedAll,
  selectedItems,
  progress,
}: CustomHeaderLeftProps) {
  const { t } = useTranslation();
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

  const onBackPress = () => goBack();

  return (
    <View style={styles.rowCenter}>
      <Animated.View style={[styles.rowCenter, backAnimatedStyle]}>
        <RippleButtonIcon testID="back-button" onPress={onBackPress}>
          <MaterialIcons name="arrow-back" size={24} color={radioButtonColor} />
        </RippleButtonIcon>
        <ThemedText type="title">{t("all_location.location")}</ThemedText>
      </Animated.View>
      <Animated.View style={[{ position: "absolute" }, animatedStyle]}>
        <TouchableOpacity
          onPress={handleSelectedAll}
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
            {t("all_location.selected_all")}
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
