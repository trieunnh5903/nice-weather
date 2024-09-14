import {
  Dimensions,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Link, router, useNavigation } from "expo-router";
import { observer } from "mobx-react-lite";
import weatherStore from "@/stores/weatherStore";
import { autorun } from "mobx";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useEffect } from "react";
import { FlatList } from "react-native-gesture-handler";
import Units from "@/constants/Units";
import { MaterialIconName } from "@/type";
import { Image } from "expo-image";
import weatherIconMapping from "@/config/weatherIconMapping";
import { useStores } from "@/hooks/useStore";

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

  useEffect(() => {
    const disposer = autorun(() => {
      console.log(
        "currentWeather",
        JSON.stringify(weatherStore.currentWeather)
      );
    });
    return disposer();
  }, []);

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
  const { currWeatherStore } = useStores();

  const weather = currWeatherStore.currentWeather[weatherStore.selectedWeather];
  // console.log("currentWeather", currentWeather.length);
  // console.log("selectedWeather", weatherStore.selectedWeather);

  const locationName =
    weather?.location.local_names.vi || weather?.location.name;
  const mainWeather = weather?.weather[0]?.main;
  const temperature = Math.round(weather?.main.temp);
  const tempRealFeel = Math.round(weather?.main.feels_like);
  const description = weather?.weather[0].description;
  const iconCode = weather.weather[0].icon as keyof typeof weatherIconMapping;
  const icon = `https://cdn.weatherbit.io/static/img/icons/${weatherIconMapping[iconCode]}.png`;
  const onLeftPress = () => {
    currWeatherStore.updateSelectedWeather("decrease");
  };

  const onRightPress = () => {
    currWeatherStore.updateSelectedWeather("increase");
  };
  return (
    <ThemedView style={styles.current}>
      <ThemedView style={styles.locationWrapper}>
        <ThemedView style={styles.navigationWrapper}>
          <TouchableOpacity onPress={onLeftPress}>
            <MaterialIcons name="chevron-left" size={32} color={iconColor} />
          </TouchableOpacity>
          <ThemedView style={styles.loationName}>
            <MaterialIcons name="location-on" size={24} color={iconColor} />
            <ThemedText>{locationName}</ThemedText>
          </ThemedView>
          <TouchableOpacity onPress={onRightPress}>
            <MaterialIcons name="chevron-right" size={32} color={iconColor} />
          </TouchableOpacity>
        </ThemedView>
        <ThemedText>{`${weatherStore.selectedWeather + 1}/${
          currWeatherStore.currentWeather.length
        }`}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.weatherDes}>
        <ThemedView style={styles.imageWrapper}>
          <Image
            style={styles.image}
            source={icon}
            transition={1000}
            contentFit="contain"
          />
        </ThemedView>
        <ThemedView>
          <ThemedText type="defaultSemiBold">{mainWeather}</ThemedText>
          <ThemedText type="label">{description}</ThemedText>
        </ThemedView>
      </ThemedView>
      <ThemedText style={styles.celcius}>
        {temperature + Units.Celsius}
      </ThemedText>
      <ThemedText type="label">
        Feels like {tempRealFeel + Units.Celsius}
      </ThemedText>
    </ThemedView>
  );
});

const styles = StyleSheet.create({
  locationWrapper: { marginBottom: 24, alignItems: "center" },
  weatherDes: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  imageWrapper: { justifyContent: "center", alignItems: "center" },
  image: {
    height: undefined,
    width: undefined,
    aspectRatio: 1,
    flex: 1,
  },
  navigationWrapper: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  current: {
    alignItems: "center",
    marginTop: 20,
    width: Dimensions.get("window").width - 32,
  },
  loationName: { flexDirection: "row", gap: 6 },
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
