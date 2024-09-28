import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lineHeight?: number;
  lightColor?: string;
  darkColor?: string;
  color?: string;
  type?:
    | "defaultLight"
    | "default"
    | "defaultMedium"
    | "defaultSemiBold"
    | "defaultBold"
    | "label"
    | "subtitle"
    | "title"
    | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  lineHeight,
  color,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const themeColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text"
  );

  return (
    <Text
      style={[
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultMedium" ? styles.defaultMedium : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "defaultBold" ? styles.defaultBold : undefined,
        type === "defaultLight" ? styles.defaultLight : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "label" ? styles.label : undefined,
        { color: color || themeColor, lineHeight },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 14,
    fontFamily: "OpenSans-Regular",
  },
  defaultSemiBold: {
    fontSize: 14,
    fontFamily: "OpenSans-SemiBold",
  },
  defaultBold: {
    fontFamily: "OpenSans-Bold",
    fontSize: 14,
  },
  defaultMedium: {
    fontSize: 14,
    fontFamily: "OpenSans-Medium",
  },
  defaultLight: {
    fontSize: 14,
    fontFamily: "OpenSans-Light",
  },
  label: {
    fontSize: 12,
    fontFamily: "OpenSans-Regular",
  },
  title: {
    fontSize: 18,
    fontFamily: "OpenSans-Bold",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "OpenSans-Bold",
  },
  link: {
    fontSize: 16,
    color: "#0a7ea4",
    fontFamily: "OpenSans-Regular",
  },
});
