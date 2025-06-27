import { StyleSheet } from "react-native";
import React, { memo } from "react";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "@/hooks/common";
import { ThemedText, ThemedView } from "../common/Themed";

interface FooterOfDeleteModeProps {
  onDeletePress: () => void;
  onCancelPress: () => void;
}

const FooterOfDeleteMode = memo(function FooterOfDeleteMode({
  onCancelPress,
  onDeletePress,
}: FooterOfDeleteModeProps) {
  const themeColor = useAppTheme();
  const { t } = useTranslation();
  return (
    <Animated.View entering={FadeInDown} exiting={FadeOutDown}>
      <ThemedView
        style={[styles.footerDelete, { borderTopColor: themeColor.border }]}
      >
        <TouchableOpacity onPress={onCancelPress}>
          <ThemedText
            color={themeColor.primary}
            style={{ fontSize: 16 }}
            type="defaultBold"
          >
            {t("all_location.cancel")}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDeletePress}>
          <ThemedText
            color={themeColor.primary}
            style={{ fontSize: 16 }}
            type="defaultBold"
          >
            {t("all_location.delete")}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </Animated.View>
  );
});

export default FooterOfDeleteMode;

const styles = StyleSheet.create({
  footerDelete: {
    flexDirection: "row",
    gap: 36,
    justifyContent: "flex-end",
    width: "100%",
    borderTopWidth: 1,
    padding: 12,
    paddingHorizontal: 30,
  },
});
