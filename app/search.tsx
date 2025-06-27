import { ActivityIndicator, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Stack } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Divider } from "react-native-paper";
import { useSearchLocation } from "@/hooks/location/useSearchLocation";
import { useAppTheme } from "@/hooks/common/useAppTheme";
import {
  CurrentLocationButton,
  SearchBar,
  SearchResults,
} from "@/components/search";
import { goBackOrExitApp } from "@/utils/navigationUtils";
import { RippleButtonIcon } from "@/components/common/Button";
import { ThemedText, ThemedView } from "@/components/common/Themed";

const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const { results, error, isLoading } = useSearchLocation(query);
  const themeColor = useAppTheme();
  const iconColor = themeColor.primary;

  const handleSearchChange = (e: string) => {
    setQuery(e);
  };

  const onBackPress = () => goBackOrExitApp();

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "",
          headerBackVisible: false,
          headerLeft: () => {
            return (
              <View style={styles.headerLeft}>
                <RippleButtonIcon onPress={onBackPress}>
                  <MaterialIcons
                    name="arrow-back"
                    size={24}
                    color={iconColor}
                  />
                </RippleButtonIcon>
                <SearchBar query={query} onChange={handleSearchChange} />
              </View>
            );
          },
          headerTintColor: iconColor,
          headerShadowVisible: false,
        }}
      />

      <Divider />
      {isLoading ? (
        <ActivityIndicator style={styles.loading} />
      ) : !query ? (
        <CurrentLocationButton />
      ) : error ? (
        <ThemedText style={styles.error}>{error}</ThemedText>
      ) : (
        <SearchResults results={results} />
      )}
    </ThemedView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  headerLeft: {
    flexDirection: "row",
  },
  currentLocation: {
    marginTop: 12,
    marginHorizontal: 16,
  },
  error: { textAlign: "center", marginTop: 20 },
  loading: { marginTop: 20 },
  header: { flexDirection: "row", alignItems: "center", gap: 6 },
  container: { flex: 1 },
  searchInput: {
    paddingHorizontal: 10,
    flex: 1,
  },
});
