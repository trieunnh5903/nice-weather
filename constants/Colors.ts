import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    primary: "#0a7ea4",
    icon: "#11181C",
    subtitleText: "#687076",
    placeholder: "#CCCCCC",
    ripple: "rgba(0,0,0,0.1)",
    border: "rgba(0,0,0,0.1)",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    primary: "#0a7ea4",
    icon: "#ECEDEE",
    subtitleText: "#9BA1A6",
    placeholder: "#AAAAAA",
    ripple: "rgba(255,255,255,0.1)",
    border: "rgba(255,255,255,0.1)",
  },
};

export const NavigationTheme = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...Colors.light,
    },
  },

  dark: {
    ...DarkTheme,
    colors: { ...DarkTheme.colors, ...Colors.dark },
  },
};

export const PaperTheme = {
  light: {
    ...MD3LightTheme,
    colors: { ...MD3LightTheme.colors, ...Colors.light },
  },

  dark: {
    ...MD3DarkTheme,
    colors: { ...MD3DarkTheme.colors, ...Colors.dark },
  },
};
