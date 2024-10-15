import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStores, weatherQueryOptions } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import * as ExpoLocation from "expo-location";
import { weatherApi } from "@/api/weatherApi";
import { router } from "expo-router";
import { Button } from "react-native-paper";

const CurrentLocationButton = observer(() => {
  const { weatherStore } = useStores();
  const [isLoading, setIsLoading] = useState(false);
  const [placeId, setPlaceId] = useState<string>("");
  const { isSuccess } = useQuery(
    weatherQueryOptions(placeId, weatherStore.temperatureUnit)
  );

  useEffect(() => {
    if (isSuccess) {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/");
      }
      setIsLoading(false);
    }
    return () => {};
  }, [isSuccess]);

  const getCurrentPosition = async () => {
    setIsLoading(true);
    try {
      let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        if (Platform.OS === "android") {
          ToastAndroid.show(
            "Permission to access location was denied. Please enable it.",
            3000
          );
        } else {
          Alert.alert(
            "Permission Denied",
            "Permission to access location was denied. Please enable it in the settings."
          );
        }
        return;
      }

      let {
        coords: { latitude, longitude },
      } = await ExpoLocation.getCurrentPositionAsync({});

      const location = await weatherApi.reverseGeocoding(
        latitude.toString(),
        longitude.toString()
      );

      if (location) {
        weatherStore.addPlace({ ...location, isUserLocation: true });
        setPlaceId(location.place_id);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Button
      loading={isLoading ? true : false}
      mode="outlined"
      style={styles.currentLocation}
      onPress={getCurrentPosition}
    >
      Use current location
    </Button>
  );
});

export default CurrentLocationButton;

const styles = StyleSheet.create({
  currentLocation: {
    marginTop: 12,
    marginHorizontal: 16,
  },
});
