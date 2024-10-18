import { useAppTheme } from "@/hooks/useAppTheme";
import { View, type ViewProps } from "react-native";

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
  paddingLeft?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingVertical?: number;
};

const ThemedView = ({
  style,
  paddingLeft,
  lightColor,
  darkColor,
  enableInsets,
  paddingVertical,
  enableInsetsHorizontal,
  enableInsetsTop,
  padding,
  paddingHorizontal,
  paddingTop,
  paddingBottom,
  flex,
  ...otherProps
}: ThemedViewProps) => {
  const insets = useSafeAreaInsets();
  const themeColor = useAppTheme();

  return (
    <View
      style={[
        {
          backgroundColor: themeColor.background,
          padding,
          paddingHorizontal,
          paddingVertical,
          paddingLeft,
          paddingTop,
          paddingBottom,
        },
        flex && { flex: 1 },
        enableInsets && {
          paddingTop: insets.top * 1.5,
          paddingHorizontal: 16,
        },
        enableInsetsHorizontal && {
          paddingHorizontal: 16,
        },
        enableInsetsTop && {
          paddingTop: insets.top,
        },
        style,
      ]}
      {...otherProps}
    />
  );
};

export default ThemedView;
