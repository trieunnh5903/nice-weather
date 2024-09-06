import { useState, useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Link } from "expo-router";
import { observer } from "mobx-react-lite";
import weatherStore from "@/stores/weatherStore";
import { autorun } from "mobx";

const HomeScreen: React.FC = observer(() => {
  return (
    <ThemedView enableInsets>
      {/* header */}
      <ThemedView style={styles.header}>
        <Link href={"/search"} asChild>
          <Pressable>
            <MaterialIcons name="add" size={24} color="black" />
          </Pressable>
        </Link>
        <MaterialIcons name="delete-outline" size={24} color="black" />
        <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
      </ThemedView>
      <CurrentWeather />
    </ThemedView>
  );
});

const CurrentWeather: React.FC = observer(({}) => {
  autorun(() => {
    console.log("weather", weatherStore.locations);
    console.log("err", weatherStore.state);
  });
  return (
    <ThemedView style={styles.current}>
      <ThemedView style={styles.locationWrapper}>
        <MaterialIcons name="location-on" size={24} color="black" />
        <ThemedText>{weatherStore.locations[0]?.name || "Van Ly"}</ThemedText>
      </ThemedView>
      <ThemedText style={styles.celcius}>26&#x2103;</ThemedText>
      <ThemedText type="defaultSemiBold">Mua nho</ThemedText>
      <ThemedText type="label">
        34&#8451;/27&#8451; RealFeel 29&#8451;
      </ThemedText>
      <ThemedText type="label">Dang co mua rao rai rac</ThemedText>
    </ThemedView>
  );
});

const styles = StyleSheet.create({
  current: { alignItems: "center", marginTop: 20 },
  locationWrapper: { flexDirection: "row", gap: 6, marginBottom: 10 },
  container: {
    flex: 1,
    padding: 16,
  },
  celcius: { fontSize: 64, lineHeight: 64, fontWeight: "300" },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 24,
  },
});

export default HomeScreen;
