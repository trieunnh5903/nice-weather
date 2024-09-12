import { Dimensions, Pressable, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { observer } from "mobx-react-lite";
import weatherStore from "@/stores/weatherStore";
import { autorun } from "mobx";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useEffect } from "react";
import { FlatList } from "react-native-gesture-handler";
import Units from "@/constants/Units";
import { MaterialIconName } from "@/type";

const HomeScreen: React.FC = observer(() => {
  const iconColor = useThemeColor({}, "icon");
  const icons: MaterialIconName[] = ["menu", "add", "delete-outline"];
  const onHeaderPress = (icon: string) => {
    switch (icon) {
      case icons[0]:
        router.navigate("/all-locations");
        break;
      case icons[1]:
        router.navigate("/search");
      default:
        break;
    }
  };
  return (
    <ThemedView enableInsets style={styles.container}>
      {/* header */}
      <ThemedView style={styles.header}>
        {icons.map((icon) => {
          return (
            <Pressable
              hitSlop={10}
              onPress={() => onHeaderPress(icon)}
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
      <CurrentWeather />
    </ThemedView>
  );
});

const CurrentWeather: React.FC = observer(() => {
  const iconColor = useThemeColor({}, "icon");
  const { currentWeather } = weatherStore;

  useEffect(() => {
    const dispose = autorun(() => {
      console.log("weather", weatherStore.currentWeather);
      console.log("status", weatherStore.state);
    });
    return () => dispose();
  }, []);

  return (
    <FlatList
      data={currentWeather}
      horizontal
      pagingEnabled
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => {
        let locationName = item?.location.local_names.vi || item.location.name;
        let mainWeather = item?.weather[0]?.main;
        let temperature = Math.round(item?.main.temp);
        let tempMax = Math.round(item?.main.temp_max);
        let tempMin = Math.round(item?.main.temp_min);
        let tempRealFeel = Math.round(item?.main.feels_like);
        let description = item?.weather[0].description;
        return (
          <ThemedView style={styles.current}>
            <ThemedView style={styles.locationWrapper}>
              <MaterialIcons name="location-on" size={24} color={iconColor} />
              <ThemedText>{locationName}</ThemedText>
            </ThemedView>
            <ThemedText style={styles.celcius}>
              {temperature + Units.Celsius}
            </ThemedText>
            <ThemedText type="defaultSemiBold">{mainWeather}</ThemedText>
            <ThemedText type="label">
              {tempMax + Units.Celsius}/{tempMin + Units.Celsius} RealFeel{" "}
              {tempRealFeel + Units.Celsius}
            </ThemedText>
            <ThemedText type="label">{description}</ThemedText>
          </ThemedView>
        );
      }}
    />
  );
});

const styles = StyleSheet.create({
  current: {
    alignItems: "center",
    marginTop: 20,
    width: Dimensions.get("window").width - 32,
  },
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
