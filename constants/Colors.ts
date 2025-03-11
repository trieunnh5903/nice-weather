import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

export const AppColors = {
  light: {
    text: "#11181C",
    background: "#fff",
    onBackground: "#f0f0f0",
    primary: "#0a7ea4",
    icon: "#11181C",
    subtitleText: "#687076",
    placeholder: "#CCCCCC",
    ripple: "rgba(0,0,0,0.1)",
    border: "#eee",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    onBackground: "#303030",
    primary: "#0a7ea4",
    icon: "#ECEDEE",
    subtitleText: "#9BA1A6",
    placeholder: "#AAAAAA",
    ripple: "rgba(255,255,255,0.1)",
    border: "rgba(255,255,255,0.3)",
  },
};

export const AppNavigationTheme = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...AppColors.light,
    },
  },

  dark: {
    ...DarkTheme,
    colors: { ...DarkTheme.colors, ...AppColors.dark },
  },
};

export const AppPaperTheme  = {
  light: {
    ...MD3LightTheme,
    colors: { ...MD3LightTheme.colors, ...AppColors.light },
  },

  dark: {
    ...MD3DarkTheme,
    colors: { ...MD3DarkTheme.colors, ...AppColors.dark },
  },
};
