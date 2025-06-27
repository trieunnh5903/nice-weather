import { Alert, Platform, StyleSheet, ToastAndroid } from "react-native";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useLanguage, useStores, useWeatherQueries } from "@/hooks";
import * as ExpoLocation from "expo-location";
import { Button } from "react-native-paper";
import { placeUtils } from "@/utils";
import { useTranslation } from "react-i18next";
import { goBackOrReset } from "@/utils/navigationUtils";
import { Place } from "@/types/weather/place";
import { reverseGeocoding } from "@/api/weatherApi";

const CurrentLocationButton = observer(() => {
  const { weatherStore } = useStores();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const [place, setPlace] = useState<Place>();
  const { currentLanguage } = useLanguage();
  const { isSuccess } = useWeatherQueries({
    unit: weatherStore.temperatureUnit,
    lat: place?.lat ?? "",
    lon: place?.lon ?? "",
    language: currentLanguage,
  });

  useEffect(() => {
    if (isSuccess) {
      goBackOrReset();
      setIsLoading(false);
    }
  }, [isSuccess]);

  const requestLocationPermission = async () => {
    const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      const message = t("location.permission_denied_message");
      if (Platform.OS === "android") {
        ToastAndroid.show(message, 3000);
      } else {
        Alert.alert(t("location.permission_denied_title"), message);
      }
      return false;
    }
    return true;
  };

  const getCurrentLocation = async () => {
    const permissionGranted = await requestLocationPermission();
    if (!permissionGranted) return;
    const {
      coords: { latitude, longitude },
    } = await ExpoLocation.getCurrentPositionAsync({});
    return { latitude, longitude };
  };

  const handleGetCurrentPosition = async () => {
    setIsLoading(true);
    try {
      const coords = await getCurrentLocation();
      if (!coords) return;

      const location = await reverseGeocoding(
        coords.latitude.toString(),
        coords.longitude.toString()
      );

      if (location) {
        const formattedPlace = {
          ...location,
          isUserLocation: true,
          ...placeUtils.formatCoordinates({
            latitude: location.lat,
            longitude: location.lon,
          }),
        };
        weatherStore.addPlace(formattedPlace);
        setPlace(formattedPlace);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      testID="use_current_location"
      loading={isLoading}
      mode="outlined"
      style={styles.currentLocation}
      onPress={handleGetCurrentPosition}
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
