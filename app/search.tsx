import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Platform,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
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
import { useSearchLocation } from "@/hooks/useSearchLocation";
import { ThemedText } from "@/components/ThemedText";
import * as ExpoLocation from "expo-location";
import { Colors } from "@/constants/Colors";
import { weatherApi } from "@/api/weatherApi";
import { useStores } from "@/hooks/useStore";
import { Place } from "@/type";
import placeUtils from "@/utils/placeUtils";
import RippleButtonIcon from "@/components/RippleButtonIcon";
import { weatherQueryOptions } from "@/hooks/useWeatherData";
import { useQuery } from "@tanstack/react-query";
import { useAppTheme } from "@/hooks/useAppTheme";

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

  const onBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      BackHandler.exitApp();
    }
  };
  const themeColor = useAppTheme();
  const iconColor = themeColor.primary;
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

const CurrentLocationButton = observer(() => {
  const { weatherStore } = useStores();
  const [isLoading, setIsLoading] = useState(false);
  const [placeId, setPlaceId] = useState<string>("");
  const { isSuccess } = useQuery(
    weatherQueryOptions(placeId, weatherStore.temperatureUnit)
  );
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

const SearchResults = ({ results }: { results: Place[] | undefined }) => {
  const [placeId, setPlaceId] = useState<string>("");
  const { weatherStore } = useStores();
  const { isSuccess } = useQuery(
    weatherQueryOptions(placeId, weatherStore.temperatureUnit)
  );
  const onPlacePress = (place: Place) => {
    weatherStore.addPlace(place);
    setPlaceId(place.place_id);
  };
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

const SearchBar = ({ query, onChange }: SearchBarProps) => {
  const themeColor = useAppTheme();
  const color = themeColor.text;
  const placeholderColor = themeColor.placeholder;

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
