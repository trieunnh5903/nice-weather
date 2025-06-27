import { useEffect } from "react";
import { useRootNavigationState, useRouter } from "expo-router";
import { useStores } from "@/hooks/common/useStore";
const Index = () => {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const { weatherStore } = useStores();
  useEffect(() => {
    if (rootNavigationState && rootNavigationState.index === 0) {
      if (weatherStore.selectedIndex === -1) {
        router.replace("/search");
      } else {
        router.replace("/home");
      }
    }
  }, [rootNavigationState, router, weatherStore.selectedIndex]);

  return null;
};

export default Index;
