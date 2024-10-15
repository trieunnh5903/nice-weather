import { PaperTheme } from "@/constants/Colors";
import { MobxStoreProvider, useStores } from "@/hooks/useStore";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientConfig } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { enableFreeze } from "react-native-screens";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

SplashScreen.preventAutoHideAsync();

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

enableFreeze(true);
export default function Layout() {
  const { weatherStore } = useStores();
  const systemTheme = useColorScheme();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime:
          weatherStore.stateTime < 0 ? Infinity : weatherStore.stateTime * 1000,
        gcTime: 24 * 24 * 3600 * 1000,
      },
    },
  });
  const persistTheme = weatherStore.theme;
  const selectTheme = persistTheme ?? systemTheme ?? "light";
  const paperTheme =
    selectTheme === "dark" ? PaperTheme.dark : PaperTheme.light;
  const navigationTheme = selectTheme === "dark" ? DarkTheme : DefaultTheme;
  const [loaded] = useFonts({
    "OpenSans-Regular": require("../assets/fonts/OpenSans-Regular.ttf"),
    "OpenSans-Medium": require("../assets/fonts/OpenSans-Medium.ttf"),
    "OpenSans-SemiBold": require("../assets/fonts/OpenSans-SemiBold.ttf"),
    "OpenSans-Bold": require("../assets/fonts/OpenSans-Bold.ttf"),
    "OpenSans-Light": require("../assets/fonts/OpenSans-Light.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        if (loaded && weatherStore.isHydrated) {
          await SplashScreen.hideAsync();
        }
      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, [loaded, weatherStore]);

  if (!loaded || !weatherStore.isHydrated) {
    console.log("loaded", loaded);
    console.log("weatherStore.isHydrated", weatherStore.isHydrated);
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MobxStoreProvider>
        <PersistQueryClientProvider
          persistOptions={{
            persister: asyncStoragePersister,
            maxAge: 24 * 24 * 3600 * 1000,
          }}
          client={queryClient}
        >
          <PaperProvider theme={paperTheme}>
            <ThemeProvider value={navigationTheme}>
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: "fade_from_bottom",
                }}
              ></Stack>
            </ThemeProvider>
          </PaperProvider>
        </PersistQueryClientProvider>
      </MobxStoreProvider>
    </GestureHandlerRootView>
  );
}
