import { PaperTheme } from "@/constants/Colors";
import weatherStore from "@/stores/weatherStore";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";

SplashScreen.preventAutoHideAsync();

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
        await weatherStore.loadLocations();
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

  if (!appIsReady) {
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
