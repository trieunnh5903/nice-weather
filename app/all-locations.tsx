import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { Stack } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialIconName } from "@/type";
import { observer, Observer } from "mobx-react-lite";
import weatherStore from "@/stores/weatherStore";
import locationUtils from "@/utils/locationUtils";
import temperatureUtils from "@/utils/temperatureUtils";
import { Menu } from "react-native-paper";
import { FlatList } from "react-native-gesture-handler";

const AllLocation = () => {
  const iconColor = useThemeColor({}, "tint");
  const icons: MaterialIconName[] = ["add", "delete-outline"];

  const CustomHeaderRight = () => {
    return (
      <ThemedView style={styles.headerRight}>
        {icons.map((icon) => {
          return (
            <Pressable
              hitSlop={10}
              // onPress={() => onHeaderPress(icon)}
              key={"header" + icon}
            >
              <MaterialIcons name={icon} size={24} color={iconColor} />
            </Pressable>
          );
        })}
        <MaterialCommunityIcons
          name="dots-vertical"
          size={24}
          color={iconColor}
        />
      </ThemedView>
    );
  };
  return (
    <ThemedView flex>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Location",
          headerRight(props) {
            return <CustomHeaderRight />;
          },
          headerTintColor: iconColor,
          headerShadowVisible: false,
          headerTitleAlign: "left",
        }}
      />
      <LocationList />
    </ThemedView>
  );
};

const LocationList = observer(() => {
  return weatherStore.currentWeather.map((weather) => {
    const { location } = weather;
    return (
      <ThemedView key={weather.id} style={styles.weather}>
        <ThemedView>
          <ThemedText>{locationUtils.getName(location)}</ThemedText>
          <ThemedText type="label">
            {locationUtils.getAddress(location)}
          </ThemedText>
        </ThemedView>
        <ThemedView>
          <ThemedText>
            {temperatureUtils.formatCelcius(weather.main.temp)}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  });
});

export default AllLocation;

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  weather: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 6,
  },
});
