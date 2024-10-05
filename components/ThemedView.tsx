import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  enableInsets?: boolean;
  enableInsetsTop?: boolean;
  enableInsetsHorizontal?: boolean;
  flex?: boolean;
  padding?: number;
  paddingHorizontal?: number;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  enableInsets,
  enableInsetsHorizontal,
  enableInsetsTop,
  padding,
  paddingHorizontal,
  flex,
  ...otherProps
}: ThemedViewProps) {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor("background", {
    light: lightColor,
    dark: darkColor,
  });

  return (
    <View
      style={[
        { backgroundColor, padding, paddingHorizontal },
        flex && { flex: 1 },
        enableInsets && {
          paddingTop: insets.top * 1.5,
          paddingHorizontal: 16,
        },
        enableInsetsHorizontal && {
          paddingHorizontal: 16,
        },
        enableInsetsTop && {
          paddingTop: insets.top * 1.5,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
