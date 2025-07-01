import { GestureResponderEvent, Pressable } from "react-native";
import React, { PropsWithChildren } from "react";
import { useAppTheme } from "@/hooks/common/useAppTheme";
import { ThemedView } from "../Themed";

interface RippleButtonProps extends PropsWithChildren {
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
  disabled?: boolean;
  rippleColor?: string;
  testID?: string | undefined;
}
const RippleButtonIcon = ({
  children,
  rippleColor,
  onPress,
  disabled,
  testID,
}: RippleButtonProps) => {
  const themeColor = useAppTheme();

  return (
    <ThemedView
      style={{
        borderRadius: 100,
        overflow: "hidden",
      }}
    >
      <Pressable
        accessibilityRole="button"
        testID={testID}
        disabled={disabled}
        android_ripple={{
          color: rippleColor || themeColor.ripple,
        }}
        style={{ padding: 6 }}
        hitSlop={3}
        onPress={onPress}
      >
        {children}
      </Pressable>
    </ThemedView>
  );
};

export default RippleButtonIcon;
