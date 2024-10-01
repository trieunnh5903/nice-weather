import React, { useEffect } from "react";
import { useRootNavigationState, useRouter } from "expo-router";
import { useStores } from "@/hooks/useStore";

const Index = () => {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const { weatherStore } = useStores();
  useEffect(() => {
    console.log("Index", rootNavigationState.index);
    if (rootNavigationState.index === 0) {
      if (weatherStore.selectedIndex === -1) {
        router.replace("/search");
      } else {
        router.replace("/home");
      }
    }
  }, [router, rootNavigationState.index, weatherStore.selectedIndex]);

  return null;
};

export default Index;
