import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { placeUtils } from "@/utils";
import ThemedView from "../ThemedView";
import ThemedText from "../ThemedText";
import { Divider } from "react-native-paper";
import { useAppTheme, useLanguage, useStores } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { Place } from "@/type";
import { router } from "expo-router";
import { queryConfig } from "@/config/queryConfig";
import { useTranslation } from "react-i18next";

interface SearchResultsProps {
  results: Place[] | undefined;
}
const SearchResults = ({ results }: SearchResultsProps) => {
  const { weatherStore } = useStores();
  const [place, setPlace] = useState<Place>();
  const { currentLanguage } = useLanguage();
  const { isSuccess, isFetching } = useQuery(
    queryConfig.currentWeatherQueryOptions(
      place?.lat || "",
      place?.lon || "",
      currentLanguage
    )
  );

  const themeColor = useAppTheme();
  const { t } = useTranslation();
  useEffect(() => {
    if (isSuccess) {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/");
      }
    }
    return () => {};
  }, [isSuccess]);

  const onPlacePress = (place: Place) => {
    const formatedPlace: Place = {
      ...place,
      ...placeUtils.formatCoordinates({
        latitude: place.lat,
        longitude: place.lon,
      }),
    };
    weatherStore.addPlace(formatedPlace);
    setPlace(formatedPlace);
  };

  if (!results) return null;
  if (results.length === 0) {
    return (
      <ThemedView style={styles.empty}>
        <ThemedText>{t("search.no_results")}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView>
      {results.map((item) => {
        const address = placeUtils.getAddress(item);
        return (
          <TouchableOpacity
            onPress={() => onPlacePress(item)}
            key={item.place_id}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 12,
              gap: 6,
            }}
          >
            <ThemedView flex>
              <ThemedText>{item.name}</ThemedText>
              <ThemedText
                type="label"
                darkColor={themeColor.primary}
                lightColor={themeColor.primary}
              >
                {address}
              </ThemedText>
            </ThemedView>
            {isFetching && item.place_id === place?.place_id && (
              <ActivityIndicator color={themeColor.primary} size={24} />
            )}
            <Divider />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default SearchResults;
const styles = StyleSheet.create({
  empty: { padding: 6, alignItems: "center" },
});
