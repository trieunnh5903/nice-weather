import { GestureResponderEvent, Pressable, View } from "react-native";
import React, { PropsWithChildren } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";

interface RippleButtonProps extends PropsWithChildren {
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
  disabled?: boolean;
  rippleColor?: string;
}
const RippleButtonIcon = ({
  children,
  rippleColor,
  onPress,
  disabled,
}: RippleButtonProps) => {
  const color = useThemeColor("ripple");
  return (
    <View
      style={{
        borderRadius: 100,
        overflow: "hidden",
      }}
    >
      <Pressable
        disabled={disabled}
        android_ripple={{
          color: rippleColor || color,
        }}
        style={{ padding: 6 }}
        hitSlop={3}
        onPress={onPress}
      >
        {children}
      </Pressable>
    </View>
  );
};

export default RippleButtonIcon;
