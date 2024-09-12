import { PaperTheme } from "@/constants/Colors";
import weatherStore from "@/stores/weatherStore";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import axios from "axios";
import { useFonts } from "expo-font";
import { router, SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";

SplashScreen.preventAutoHideAsync();
axios.defaults.baseURL = process.env.EXPO_PUBLIC_OPEN_WEATHER_URL_KEY;

export default function Layout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const colorScheme = useColorScheme();
  const paperTheme =
    colorScheme === "dark" ? PaperTheme.dark : PaperTheme.light;
  const [loaded, error] = useFonts({
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        await weatherStore.loadCurrentWeather();
      } catch (e) {
        console.warn(e);
      } finally {
        if (loaded || error) {
          setAppIsReady(true);
          await SplashScreen.hideAsync();
        }
      }
    }
    prepare();
  }, [error, loaded]);

  useEffect(() => {
    if (appIsReady) {
      if (weatherStore.currentWeather.length === 0) {
        router.replace("/search"); // Điều hướng đến search nếu condition là false
      }
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  return (
    <GestureHandlerRootView>
      <PaperProvider theme={paperTheme}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack
            initialRouteName={
              weatherStore.currentWeather.length > 0 ? "index" : "search"
            }
            screenOptions={{ headerShown: false }}
          >
            {/* <Stack.Screen name="index" />
            <Stack.Screen name="search" /> */}
          </Stack>
        </ThemeProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
