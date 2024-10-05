/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#11181C",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    placeholder: "#CCCCCC",
    ripple: "rgba(0,0,0,0.1)",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#ECEDEE",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    placeholder: "#AAAAAA",
    ripple: "rgba(255,255,255,0.1)",
  },
};

export const PaperTheme = {
  light: {
    ...MD3LightTheme,
    colors: { ...MD3LightTheme.colors, primary: Colors.light.text },
  },

  dark: {
    ...MD3DarkTheme,
    colors: { ...MD3DarkTheme.colors, primary: Colors.dark.text },
  },
};
