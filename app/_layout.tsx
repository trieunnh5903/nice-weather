import { PaperTheme } from "@/constants/Colors";
import { MobxStoreProvider, useStores } from "@/hooks/useStore";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useNavigationContainerRef } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { enableFreeze } from "react-native-screens";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 3600 * 1000, gcTime: 2 * 24 * 3600 * 1000 },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

enableFreeze(true);
export default function Layout() {
  const ref = useNavigationContainerRef();
  const { weatherStore } = useStores();
  const colorScheme = useColorScheme();
  const paperTheme =
    colorScheme === "dark" ? PaperTheme.dark : PaperTheme.light;
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
  }, [loaded, ref, weatherStore]);

  if (!loaded || !weatherStore.isHydrated) {
    console.log("loaded", loaded);
    console.log("weatherStore.isHydrated", weatherStore.isHydrated);
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MobxStoreProvider>
        <PersistQueryClientProvider
          persistOptions={{ persister: asyncStoragePersister }}
          client={queryClient}
        >
          <PaperProvider theme={paperTheme}>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
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
