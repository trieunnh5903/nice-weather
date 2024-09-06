import { Pressable, StyleSheet, ToastAndroid } from "react-native";
import React, { useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import { TextInput } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { Button, Divider } from "react-native-paper";
import * as Location from "expo-location";
import weatherStore from "@/stores/weatherStore";
import { Observer } from "mobx-react-lite";

const SearchScreen = () => {
  const getCurrentPosition = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        ToastAndroid.show("Permission to access location was denied", 1000);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      weatherStore.addLocation(
        location.coords.latitude,
        location.coords.longitude
      );
    } catch (error) {
      console.log(error);

      ToastAndroid.show("Error", 1000);
    }
  };

  return (
    <ThemedView enableInsetsTop style={{ flex: 1 }}>
      <ThemedView
        enableInsetsHorizontal
        style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
      >
        <Pressable onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </Pressable>
        <SearchBar />
      </ThemedView>
      <Divider style={{ marginTop: 12 }} />
      <Observer>
        {() => (
          <Button
            mode="outlined"
            style={{
              marginTop: 12,
              borderColor: "#e0e0e0",
              marginHorizontal: 16,
            }}
            onPress={getCurrentPosition}
            textColor="#000"
            rippleColor={"#e0e0e0"}
          >
            Use current location
          </Button>
        )}
      </Observer>
    </ThemedView>
  );
};

export default SearchScreen;

// Custom Search Bar Component
const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <TextInput
      style={styles.searchInput}
      placeholder="Find location"
      cursorColor={"#000"}
      value={searchQuery}
      onChangeText={setSearchQuery}
    />
  );
};

const styles = StyleSheet.create({
  searchInput: {
    paddingHorizontal: 10,
    flex: 1,
  },
});
