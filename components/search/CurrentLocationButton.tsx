import { Alert, Platform, StyleSheet, ToastAndroid } from "react-native";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStores } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import * as ExpoLocation from "expo-location";
import { weatherApi } from "@/api/weatherApi";
import { router } from "expo-router";
import { Button } from "react-native-paper";
import { Place } from "@/type";
import { placeUtils } from "@/utils";
import { queryConfig } from "@/config/queryConfig";
import { useTranslation } from "react-i18next";

const CurrentLocationButton = observer(() => {
  const { weatherStore } = useStores();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const [place, setPlace] = useState<Place>();
  const { isSuccess } = useQuery(
    queryConfig.weatherQueryOptions(
      place?.lat || "",
      place?.lon || "",
      "metric"
    )
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
        const formatedPlace: Place = {
          ...location,
          isUserLocation: true,
          ...placeUtils.formatCoordinates({
            latitude: location.lat,
            longitude: location.lon,
          }),
        };
        weatherStore.addPlace(formatedPlace);
        setPlace(formatedPlace);
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
      {t("search.use_current_location")}
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
