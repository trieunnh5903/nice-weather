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
import { goBackOrReset } from "@/utils/navigationUtils";

interface SearchResultsProps {
  results: Place[] | undefined;
}
const SearchResults = ({ results }: SearchResultsProps) => {
  const { weatherStore } = useStores();
  const [place, setPlace] = useState<Place>();
  const { currentLanguage } = useLanguage();
  const { isSuccess: isSuccess1 } = useQuery(
    queryConfig.currentWeatherQueryOptions(
      place?.lat || "",
      place?.lon || "",
      currentLanguage
    )
  );

  const { isSuccess: isSuccess2 } = useQuery(
    queryConfig.forecastQueryOptions(
      place?.lat || "",
      place?.lon || "",
      "metric"
    )
  );

  const { isSuccess: isSuccess3 } = useQuery(
    queryConfig.astronomyQueryOptions(place?.lat || "", place?.lon || "")
  );

  const isSuccess = isSuccess1 && isSuccess2 && isSuccess3;
  const themeColor = useAppTheme();
  const { t } = useTranslation();
  useEffect(() => {
    if (isSuccess) {
      goBackOrReset();
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
            {!isSuccess && item.place_id === place?.place_id && (
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
