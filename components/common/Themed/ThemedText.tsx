import { useAppTheme } from "@/hooks/common/useAppTheme";
import { Text, type TextProps, StyleSheet } from "react-native";

export type ThemedTextProps = TextProps & {
  lineHeight?: number;
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
  lineHeight,
  fontSize,
  color,
  uppercase,
  type = "default",
  ...rest
}: ThemedTextProps) => {
  const themeColor = useAppTheme();
  const getTypeStyle = (type: ThemedTextProps["type"]) => {
    switch (type) {
      case "defaultLight":
        return styles.defaultLight;
      case "defaultMedium":
        return styles.defaultMedium;
      case "defaultSemiBold":
        return styles.defaultSemiBold;
      case "defaultBold":
        return styles.defaultBold;
      case "title":
        return styles.title;
      case "subtitle":
        return styles.subtitle;
      case "label":
        return styles.label;
      case "link":
        return styles.link;
      case "default":
      default:
        return styles.default;
    }
  };
  return (
    <Text
      style={[
        getTypeStyle(type),
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
