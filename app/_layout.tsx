import { AppNavigationTheme, AppPaperTheme } from "@/constants/colors";
import { MobxStoreProvider, useStores } from "@/hooks/useStore";
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useMemo } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import * as StatusBar from "expo-status-bar";
import * as Localization from "expo-localization";
import "@/i18n";
import { useTranslation } from "react-i18next";
import { LANGUAGE_STORAGE_KEY } from "@/constants/languages";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { createQueryClient } from "@/libs/react-query";
import { Fonts } from "@/constants/fonts";

SplashScreen.preventAutoHideAsync();

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

export default function Layout() {
  const { i18n } = useTranslation();
  const { weatherStore } = useStores();
  const systemTheme = useColorScheme();
  const [loaded] = useFonts(Fonts);

  const queryClient = useMemo(
    () => createQueryClient(weatherStore.stateTime),
    [weatherStore.stateTime]
  );

  useEffect(() => {
    async function loadLanguage() {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        const language =
          savedLanguage ?? Localization.getLocales()[0].languageCode ?? "en";
        i18n.changeLanguage(language);
      } catch (e) {
        console.warn(e);
      }
    }
    loadLanguage();
  }, [i18n, loaded, weatherStore.isHydrated]);

  useEffect(() => {
    if (loaded && weatherStore.isHydrated) {
      SplashScreen.hideAsync();
    }
    return () => {};
  }, [loaded, weatherStore.isHydrated]);

  useEffect(() => {
    const selectTheme = weatherStore.theme ?? systemTheme ?? "light";
    StatusBar.setStatusBarStyle(selectTheme === "dark" ? "light" : "dark");
    return () => {};
  }, [systemTheme, weatherStore.theme]);

  const { paperTheme, navigationTheme } = useMemo(() => {
    const persistTheme = weatherStore.theme;
    const selectTheme = persistTheme ?? systemTheme ?? "light";

    return {
      paperTheme:
        selectTheme === "dark" ? AppPaperTheme.dark : AppPaperTheme.light,
      navigationTheme:
        selectTheme === "dark"
          ? AppNavigationTheme.dark
          : AppNavigationTheme.light,
    };
  }, [weatherStore.theme, systemTheme]);

  if (!loaded || !weatherStore.isHydrated) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
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
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
