import { useAppTheme } from "@/hooks/common/useAppTheme";
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
  lightColor,
  darkColor,
  enableInsets,
  enableInsetsHorizontal,
  enableInsetsTop,
  padding,
  paddingHorizontal,
  paddingLeft,
  paddingTop,
  paddingBottom,
  paddingVertical,
  flex,
  ...otherProps
}: ThemedViewProps) => {
  const insets = useSafeAreaInsets();
  const themeColor = useAppTheme();

  const resolvedPaddingTop =
    paddingTop ??
    (enableInsetsTop
      ? insets.top
      : enableInsets
      ? insets.top * 1.5
      : undefined);

  const resolvedPaddingHorizontal =
    paddingHorizontal ??
    (enableInsets || enableInsetsHorizontal ? 16 : undefined);

  const containerStyle = {
    backgroundColor: themeColor.background,
    padding,
    paddingLeft,
    paddingBottom,
    paddingVertical,
    paddingTop: resolvedPaddingTop,
    paddingHorizontal: resolvedPaddingHorizontal,
    ...(flex && { flex: 1 }),
  };

  return <View style={[containerStyle, style]} {...otherProps} />;
};

export default ThemedView;
