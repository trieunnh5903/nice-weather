import { router } from "expo-router";
import { BackHandler } from "react-native";

export const goBackOrExitApp = () => {
  if (router.canGoBack()) {
    router.back();
  } else {
    BackHandler.exitApp();
  }
};

export const goBack = () => {
  if (router.canGoBack()) {
    router.back();
  }
};

export const goBackOrReset = () => {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace("/");
  }
};
