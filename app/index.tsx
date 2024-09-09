import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { observer } from "mobx-react-lite";
import weatherStore from "@/stores/weatherStore";
import { autorun } from "mobx";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useEffect } from "react";

const HomeScreen: React.FC = observer(() => {
  const iconColor = useThemeColor({}, "icon");
  return (
    <ThemedView enableInsets style={styles.container}>
      {/* header */}
      <ThemedView style={styles.header}>
        <Link href={"/search"} asChild>
          <Pressable>
            <MaterialIcons name="add" size={24} color={iconColor} />
          </Pressable>
        </Link>
        <MaterialIcons name="delete-outline" size={24} color={iconColor} />
        <MaterialCommunityIcons
          name="dots-vertical"
          size={24}
          color={iconColor}
        />
      </ThemedView>
      <CurrentWeather />
    </ThemedView>
  );
});

const CurrentWeather: React.FC = observer(() => {
  const iconColor = useThemeColor({}, "icon");
  const { locations } = weatherStore;
  const location = locations[0];
  const locationName = location?.name || "Van Ly";
  const mainWeather = location?.weather[0]?.main || "Mua nho";
  const temperature = Math.round(location?.main.temp || 25);
  const tempMax = Math.round(location?.main.temp_max || 32);
  const tempMin = Math.round(location?.main.temp_min || 30);
  const tempRealFeel = Math.round(location?.main.feels_like || 35);
  const description =
    location?.weather[0].description || "Dang co mua rao rai rac";
  useEffect(() => {
    const dispose = autorun(() => {
      console.log("weather", weatherStore.locations);
      console.log("err", weatherStore.state);
    });
    return () => dispose(); // Clean up autorun when component unmounts
  }, []);

  return (
    <ThemedView style={styles.current}>
      <ThemedView style={styles.locationWrapper}>
        <MaterialIcons name="location-on" size={24} color={iconColor} />
        <ThemedText>{locationName}</ThemedText>
      </ThemedView>
      <ThemedText style={styles.celcius}>{temperature}&#x2103;</ThemedText>
      <ThemedText type="defaultSemiBold">{mainWeather}</ThemedText>
      <ThemedText type="label">
        {tempMax}&#8451;/
        {tempMin}&#8451; RealFeel {tempRealFeel}&#8451;
      </ThemedText>
      <ThemedText type="label">{description}</ThemedText>
    </ThemedView>
  );
});

const styles = StyleSheet.create({
  current: { alignItems: "center", marginTop: 20 },
  locationWrapper: { flexDirection: "row", gap: 6 },
  container: {
    flex: 1,
  },
  celcius: {
    fontSize: 64,
    fontWeight: "300",
    fontFamily: "SpaceMono-Regular",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 24,
  },
});

export default HomeScreen;
