import { onlineManager } from "@tanstack/react-query";
import * as Network from "expo-network";

export function setupOnlineManager() {
  onlineManager.setEventListener((setOnline) => {
    const checkInternet = async () => {
      const state = await Network.getNetworkStateAsync();
      setOnline(!!state.isInternetReachable);
    };
    checkInternet();
    const interval = setInterval(checkInternet, 5000);

    return () => clearInterval(interval);
  });
}
