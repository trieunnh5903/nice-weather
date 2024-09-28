import { PaperTheme } from "@/constants/Colors";
import { MobxStoreProvider } from "@/hooks/useStore";
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
    "OpenSans-Regular": require("../assets/fonts/OpenSans-Regular.ttf"),
    "OpenSans-Medium": require("../assets/fonts/OpenSans-Medium.ttf"),
    "OpenSans-SemiBold": require("../assets/fonts/OpenSans-SemiBold.ttf"),
    "OpenSans-Bold": require("../assets/fonts/OpenSans-Bold.ttf"),
    "OpenSans-Light": require("../assets/fonts/OpenSans-Light.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        await weatherStore.loadCurrentWeather();
        if (loaded) {
          await SplashScreen.hideAsync();
          setAppIsReady(true);
        }
      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, [error, loaded]);

  useEffect(() => {
    (async function () {
      if (appIsReady) {
        if (weatherStore.currentWeather.length === 0) {
          router.replace("/search");
        }
      }
    })();
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  return (
    <GestureHandlerRootView>
      <MobxStoreProvider>
        <PaperProvider theme={paperTheme}>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack
              initialRouteName={
                weatherStore.currentWeather.length > 0 ? "index" : "search"
              }
              screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}
            >
              {/* <Stack.Screen name="index" />
            <Stack.Screen name="search" /> */}
            </Stack>
          </ThemeProvider>
        </PaperProvider>
      </MobxStoreProvider>
    </GestureHandlerRootView>
  );
}
