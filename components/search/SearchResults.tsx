import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { placeUtils } from "@/utils";
import ThemedView from "../common/Themed/ThemedView";
import ThemedText from "../common/Themed/ThemedText";
import { useLanguage, useStores, useWeatherQueries } from "@/hooks";
import { useTranslation } from "react-i18next";
import { goBackOrReset } from "@/utils/navigationUtils";
import { Place } from "@/types/weather/place";
import { PlaceItem } from "./PlaceItem";

interface SearchResultsProps {
  results: Place[] | null;
}
const SearchResults = ({ results }: SearchResultsProps) => {
  const { weatherStore } = useStores();
  const { currentLanguage } = useLanguage();
  const [selectedPlace, setSelectedPlace] = useState<Place>();
  const { isSuccess } = useWeatherQueries({
    lat: selectedPlace?.lat ?? "",
    lon: selectedPlace?.lon ?? "",
    unit: weatherStore.temperatureUnit,
    language: currentLanguage,
  });

  const { t } = useTranslation();
  useEffect(() => {
    if (isSuccess && selectedPlace) {
      goBackOrReset();
    }
    return () => {};
  }, [isSuccess, selectedPlace]);

  const onPlacePress = (place: Place) => {
    const formatedPlace: Place = {
      ...place,
      ...placeUtils.formatCoordinates({
        latitude: place.lat,
        longitude: place.lon,
      }),
    };
    weatherStore.addPlace(formatedPlace);
    setSelectedPlace(formatedPlace);
  };

  if (!results) return null;
  if (results.length === 0) {
    return (
      <ThemedView style={styles.empty}>
        <ThemedText testID="no_results">{t("search.no_results")}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView>
      {results.map((item) => {
        return (
          <PlaceItem
            key={item.place_id}
            item={item}
            onPress={onPlacePress}
            loading={item.place_id === selectedPlace?.place_id && !isSuccess}
          />
        );
      })}
    </ScrollView>
  );
};

export default SearchResults;
const styles = StyleSheet.create({
  empty: { padding: 6, alignItems: "center" },
});
