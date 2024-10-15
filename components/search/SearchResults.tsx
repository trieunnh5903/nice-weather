import { TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { placeUtils } from "@/utils";
import ThemedView from "../ThemedView";
import ThemedText from "../ThemedText";
import { Divider } from "react-native-paper";
import { useAppTheme, useStores, weatherQueryOptions } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { Place } from "@/type";
import { router } from "expo-router";

interface SearchResultsProps {
  results: Place[] | undefined;
}
const SearchResults = ({ results }: SearchResultsProps) => {
  const [placeId, setPlaceId] = useState<string>("");
  const { weatherStore } = useStores();
  const { isSuccess } = useQuery(
    weatherQueryOptions(placeId, weatherStore.temperatureUnit)
  );
  const themeColor = useAppTheme();

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
    weatherStore.addPlace(place);
    setPlaceId(place.place_id);
  };

  if (!results) return null;
  if (results.length === 0) {
    return (
      <ThemedView style={{ padding: 6, alignItems: "center" }}>
        <ThemedText>No results found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView>
      {results.map((place) => {
        const address = placeUtils.getAddress(place);
        return (
          <TouchableOpacity
            onPress={() => onPlacePress(place)}
            key={place.place_id}
          >
            <ThemedView style={{ padding: 12 }}>
              <ThemedText>{place.name}</ThemedText>
              <ThemedText
                type="label"
                darkColor={themeColor.primary}
                lightColor={themeColor.primary}
              >
                {address}
              </ThemedText>
            </ThemedView>
            <Divider />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default SearchResults;

