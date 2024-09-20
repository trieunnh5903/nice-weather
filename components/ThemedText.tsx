import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lineHeight?: number;
  lightColor?: string;
  darkColor?: string;
  color?: string;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "defaultBold"
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
    fontSize: 16,
    fontFamily: "SpaceMono-Regular",
  },
  defaultSemiBold: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "SpaceMono-Regular",
  },
  defaultBold: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "SpaceMono-Regular",
  },
  label: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "SpaceMono-Regular",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "SpaceMono-Regular",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "SpaceMono-Regular",
  },
  link: {
    fontSize: 16,
    color: "#0a7ea4",
    fontFamily: "SpaceMono-Regular",
  },
});
