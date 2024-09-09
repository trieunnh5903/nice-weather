import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  DefaultTheme,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const colorScheme = useColorScheme();
  const paperTheme =
    colorScheme === "dark"
      ? {
          ...MD3DarkTheme,
          colors: { ...MD3DarkTheme.colors, primary: "#ECEDEE" },
        }
      : { ...MD3LightTheme, colors: { ...MD3LightTheme.colors, primary: "#11181C"  } };
  const [loaded, error] = useFonts({
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [error, loaded]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <GestureHandlerRootView>
      <PaperProvider theme={paperTheme}>
        <Stack screenOptions={{ headerShown: false }} />
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
