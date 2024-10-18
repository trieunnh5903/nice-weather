import { useAppTheme } from "@/hooks/useAppTheme";
import { Text, type TextProps, StyleSheet } from "react-native";

export type ThemedTextProps = TextProps & {
  lineHeight?: number;
  lightColor?: string;
  darkColor?: string;
  color?: string;
  uppercase?: boolean;
  fontSize?: number | undefined;
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

const ThemedText = ({
  style,
  lightColor,
  darkColor,
  lineHeight,
  fontSize,
  color,
  uppercase,
  type = "default",
  ...rest
}: ThemedTextProps) => {
  const themeColor = useAppTheme();

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
        !!fontSize && { fontSize },
        uppercase && { textTransform: "uppercase" },
        { color: color || themeColor.text, lineHeight },
        style,
      ]}
      {...rest}
    />
  );
};

export default ThemedText;
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
    fontWeight: "100",
  },
  label: {
    fontSize: 12,
    fontFamily: "OpenSans-Bold",
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
