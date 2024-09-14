import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Platform,
  Pressable,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { Button, Divider } from "react-native-paper";
import weatherStore from "@/stores/weatherStore";
import { observer } from "mobx-react-lite";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useSearchLocation } from "@/hooks/useSearchLocation";
import { ThemedText } from "@/components/ThemedText";
import { Location } from "@/type";
import * as ExpoLocation from "expo-location";
import { Colors } from "@/constants/Colors";
import { weatherApi } from "@/api/weatherApi";

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

  const iconColor = useThemeColor({}, "tint");
  return (
    <ThemedView enableInsetsTop style={styles.container}>
      <ThemedView enableInsetsHorizontal style={styles.header}>
        <Pressable onPress={onBackPress}>
          <MaterialIcons name="arrow-back" size={24} color={iconColor} />
        </Pressable>
        <SearchBar query={query} onChange={handleSearchChange} />
      </ThemedView>
      <Divider style={{ marginTop: 12 }} />
      {/* {!query ? <CurrentLocationButton /> : <SearchResults results={results} />} */}
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
const CurrentLocationButton = observer(() => {
  const getCurrentPosition = async () => {
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

      const location = await weatherApi.reverseGeocoding(latitude, longitude);

      if (location) {
        await weatherStore.addCurrentWeather(location);
      }

      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to retrieve your location. Please try again."
      );
      console.log(error);
    }
  };

  return (
    <Button
      loading={weatherStore.state === "pending" ? true : false}
      mode="outlined"
      style={{
        marginTop: 12,
        marginHorizontal: 16,
      }}
      onPress={getCurrentPosition}
    >
      Use current location
    </Button>
  );
});

const SearchResults = ({ results }: { results: Location[] | undefined }) => {
  if (!results) return;
  if (results.length === 0) {
    return (
      <ThemedView style={{ padding: 6, alignItems: "center" }}>
        <ThemedText>No results found</ThemedText>
      </ThemedView>
    );
  }

  const onLocationPress = async (location: Location) => {
    await weatherStore.addCurrentWeather(location);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <ScrollView>
      {results.map((location) => {
        const subtitleParts: string[] = [];
        if (location.local_names?.vi) {
          subtitleParts.push(location.local_names.vi);
        }

        if (location.state) {
          subtitleParts.push(location.state);
        }

        subtitleParts.push(location.country);

        const subtitle = subtitleParts.join(", ");

        return (
          <TouchableOpacity
            onPress={() => onLocationPress(location)}
            key={`${location.lat}-${location.lon}-${location.country}-${location.name}`}
          >
            <ThemedView style={{ padding: 12 }}>
              <ThemedText>{location.name}</ThemedText>
              <ThemedText
                type="label"
                darkColor={Colors.dark.tint}
                lightColor={Colors.light.tint}
              >
                {subtitle}
              </ThemedText>
            </ThemedView>
            <Divider />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};
interface SearchBarProps {
  query: string;
  onChange: (text: string) => void;
}

const SearchBar = ({ query, onChange }: SearchBarProps) => {
  const color = useThemeColor({}, "text");
  const placeholderColor = useThemeColor({}, "placeholder");

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

const styles = StyleSheet.create({
  error: { textAlign: "center", marginTop: 20 },
  loading: { marginTop: 20 },
  header: { flexDirection: "row", alignItems: "center", gap: 6 },
  container: { flex: 1 },
  searchInput: {
    paddingHorizontal: 10,
    flex: 1,
  },
});
