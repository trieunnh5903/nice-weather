import { useEffect } from "react";
import { useRootNavigationState, useRouter } from "expo-router";
import { useStores } from "@/hooks/useStore";
import * as StatusBar from "expo-status-bar";
const Index = () => {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const { weatherStore } = useStores();
  useEffect(() => {
    console.log("Index", rootNavigationState.index);
    StatusBar.setStatusBarStyle(
      weatherStore.theme === "dark" ? "light" : "dark"
    );
    if (rootNavigationState.index === 0) {
      if (weatherStore.selectedIndex === -1) {
        router.replace("/search");
      } else {
        router.replace("/home");
      }
    }
  }, [
    router,
    rootNavigationState.index,
    weatherStore.selectedIndex,
    weatherStore.theme,
  ]);

  return null;
};

export default Index;
