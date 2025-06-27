import * as Location from "expo-location";
import { useEffect, useState } from "react";

export function useCurrentPosition() {
  const [granted, setGranted] = useState(true);
  const [location, setLocation] = useState<Location.LocationObjectCoords>();
  const [error, setError] = useState(false);
  useEffect(() => {
    (async function () {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setGranted(false);
        } else {
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location.coords);
        }
      } catch (error) {
        console.log(error);
        setError(true);
      }
    })();
    return () => {};
  }, []);
  return { granted, location, error };
}
