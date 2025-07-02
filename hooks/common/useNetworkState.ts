import * as Network from "expo-network";
import { useEffect, useState } from "react";

export function useNetworkState() {
  const [networkState, setNetworkState] = useState<Network.NetworkState | null>(
    null
  );

  useEffect(() => {
    let isMounted = true;

    const fetchNetworkState = async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        if (isMounted) {
          setNetworkState(state);
        }
      } catch (err) {
        console.error("Error fetching network state:", err);
      }
    };

    fetchNetworkState();
    const interval = setInterval(fetchNetworkState, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return networkState;
}
