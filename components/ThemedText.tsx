import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lineHeight?: number;
  lightColor?: string;
  darkColor?: string;
  color?: string;
  fontSize?: number;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "defaultBold"
    | "defaultLight"
    | "subtitle"
    | "link"
    | "label";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  lineHeight,
  color,
  fontSize,
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
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "defaultBold" ? styles.defaultBold : undefined,
        type === "defaultLight" ? styles.defaultLight : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "label" ? styles.label : undefined,
        { color: color || themeColor, lineHeight, fontSize },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    fontFamily: "OpenSans-Regular",
  },
  defaultSemiBold: {
    fontSize: 16,
    fontFamily: "OpenSans-SemiBold",
  },
  defaultBold: {
    fontSize: 16,
    fontFamily: "OpenSans-Bold",
  },
  defaultMedium: {
    fontSize: 16,
    fontFamily: "OpenSans-Medium",
  },
  defaultLight: {
    fontSize: 16,
    fontFamily: "OpenSans-Light",
  },
  label: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "OpenSans-Regular",
  },
  title: {
    fontSize: 20,
    fontFamily: "OpenSans-Bold",
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "OpenSans-Bold",
  },
  link: {
    fontSize: 16,
    color: "#0a7ea4",
    fontFamily: "OpenSans-Regular",
  },
});
