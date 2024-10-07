import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Platform,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import React, { useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { router, Stack } from "expo-router";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { Button, Divider } from "react-native-paper";
import { observer } from "mobx-react-lite";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useSearchLocation } from "@/hooks/useSearchLocation";
import { ThemedText } from "@/components/ThemedText";
import * as ExpoLocation from "expo-location";
import { Colors } from "@/constants/Colors";
import { weatherApi } from "@/api/weatherApi";
import { useStores } from "@/hooks/useStore";
import { StatusBar } from "expo-status-bar";
import { Place } from "@/type";
import placeUtils from "@/utils/placeUtils";
import RippleButtonIcon from "@/components/RippleButtonIcon";

interface SearchBarProps {
  query: string;
  onChange: (text: string) => void;
}

const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const { results, error, isLoading } = useSearchLocation(query);

  const handleSearchChange = (e: string) => {
    setQuery(e);
  };
  console.log("search");

  const onBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      BackHandler.exitApp();
    }
  };

  const iconColor = useThemeColor("tint");
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
      <StatusBar style="auto" />

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

const CurrentLocationButton = observer(() => {
  const { weatherStore } = useStores();
  const getCurrentPosition = async () => {
    try {
      weatherStore.setState("loading");
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
        await weatherStore.addPlace({ ...location, isUserLocation: true });
      }

      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Button
      loading={weatherStore.state === "loading" ? true : false}
      mode="outlined"
      style={styles.currentLocation}
      onPress={getCurrentPosition}
    >
      Use current location
    </Button>
  );
});

const SearchResults = ({ results }: { results: Place[] | undefined }) => {
  const { weatherStore } = useStores();
  if (!results) return;
  if (results.length === 0) {
    return (
      <ThemedView style={{ padding: 6, alignItems: "center" }}>
        <ThemedText>No results found</ThemedText>
      </ThemedView>
    );
  }

  const onPlacePress = async (place: Place) => {
    await weatherStore.addPlace(place);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

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
                darkColor={Colors.dark.tint}
                lightColor={Colors.light.tint}
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

const SearchBar = ({ query, onChange }: SearchBarProps) => {
  const color = useThemeColor("text");
  const placeholderColor = useThemeColor("placeholder");

  return (
    <TextInput
      style={[styles.searchInput, { color }]}
      placeholder="Find location"
      cursorColor={color}
      value={query}
      placeholderTextColor={placeholderColor}
      onChangeText={onChange}
    />
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
