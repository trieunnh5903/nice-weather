import { Alert, ColorValue, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { observer } from "mobx-react-lite";
import {
  FlatList,
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  PanGestureHandlerEventPayload,
  ScrollView,
} from "react-native-gesture-handler";
import Units from "@/constants/Units";
import { Image, ImageBackground } from "expo-image";
import { useStores } from "@/hooks/useStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { lightTextColor, useWeatherTheme } from "@/hooks/useWeatherTheme";
import { memo, useCallback, useEffect, useState } from "react";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import RippleButtonIcon from "@/components/RippleButtonIcon";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import * as NavigationBar from "expo-navigation-bar";
import { Hourly, MaterialIconName } from "@/type";
import { StatusBar } from "expo-status-bar";
import { CommonActions } from "@react-navigation/native";
import { Path, Svg, Text as TextSvg } from "react-native-svg";
import { Size } from "@/constants/Size";
import weatherUtils from "@/utils/weatherUtils";
import { autorun } from "mobx";
import placeUtils from "@/utils/placeUtils";
import weatherIcon from "@/config/weatherIcon";
interface HeaderIconsProps {
  onHeaderPress: (icon: string) => void;
  headerIcons: MaterialIconName[];
}

const HomeScreen: React.FC = observer(() => {
  console.log("home");
  const headerIcons: MaterialIconName[] = ["menu", "add", "delete-outline"];
  const insets = useSafeAreaInsets();
  const { weatherStore } = useStores();
  // const weather = weatherStore.selectedCurrentWeather.weather[0];
  const [navigationBarColor, setNavigationBarColor] =
    useState<ColorValue>("#f2f2f2");
  // const weatherTheme = useWeatherTheme({
  //   iconCode: weather.icon,
  //   weatherCode: weather.id,
  // });

  useEffect(() => {
    // const diposer = autorun(() => {
    //   console.log(weatherStore.places);
    //   console.log(weatherStore.weather);
    // });
    const fetchDefaultColor = async () => {
      const currentColor = await NavigationBar.getBackgroundColorAsync();
      setNavigationBarColor(currentColor);
    };
    fetchDefaultColor();
    // return diposer();
  }, [weatherStore]);

  // useFocusEffect(
  //   useCallback(() => {
  //     if (weatherTheme) {
  //       NavigationBar.setBackgroundColorAsync(weatherTheme.backgroundColor);
  //     }

  //     return () => {
  //       NavigationBar.setBackgroundColorAsync(navigationBarColor);
  //     };
  //   }, [navigationBarColor, weatherTheme])
  // );

  const navigation = useNavigation();
  const onHeaderPress = (icon: string) => {
    switch (icon) {
      case headerIcons[0]:
        router.navigate("/all-locations");
        break;
      case headerIcons[1]:
        router.navigate("/search");
        break;
      case headerIcons[2]:
        Alert.alert("", "Delete this location?", [
          { text: "No" },
          {
            text: "Yes",
            onPress: () => {
              if (weatherStore.allPlaceIds.length === 1) {
                navigation.dispatch(
                  CommonActions.reset({
                    routes: [{ name: "index", key: "index" }],
                  })
                );
                weatherStore.deletePlace(weatherStore.selectedPlaceId);
              } else {
                weatherStore.deletePlace(weatherStore.selectedPlaceId);
              }
            },
          },
        ]);
        break;
      default:
        break;
    }
  };

  // if (!weatherTheme) {
  //   return;
  // }
  const backgroundColor = useThemeColor("background");

  const place = weatherStore.selectedPlace;

  const iconColor = useThemeColor("icon");
  const onLeftPress = useCallback(() => {
    weatherStore.updateSelectedPlace("decrease");
  }, [weatherStore]);

  const onRightPress = useCallback(() => {
    weatherStore.updateSelectedPlace("increase");
  }, [weatherStore]);

  const sunriseTomorrow = weatherStore.selectedSunrise.results[1];

  return (
    <>
      <StatusBar />
      <ScrollView
        stickyHeaderIndices={[0]}
        style={[{ paddingTop: insets.top, backgroundColor }]}
      >
        <View>
          <HeaderIcons
            headerIcons={headerIcons}
            onHeaderPress={onHeaderPress}
          />
          <View style={styles.navigationWrapper}>
            {true && (
              <Animated.View entering={FadeIn} exiting={FadeOut}>
                <RippleButtonIcon
                  rippleColor={Colors.dark.ripple}
                  onPress={onLeftPress}
                >
                  <MaterialIcons
                    name="chevron-left"
                    size={32}
                    color={iconColor}
                  />
                </RippleButtonIcon>
              </Animated.View>
            )}

            <View style={styles.locationWrapper}>
              <View style={styles.loationName}>
                {place.isUserLocation && (
                  <MaterialIcons
                    name="location-on"
                    size={16}
                    color={iconColor}
                  />
                )}
                <ThemedText color={iconColor}>{place.name}</ThemedText>
              </View>
              <ThemedText color={iconColor}>{`${
                weatherStore.selectedIndex + 1
              }/${weatherStore.allPlaceIds.length}`}</ThemedText>
            </View>

            {true && (
              <Animated.View entering={FadeIn} exiting={FadeOut}>
                <RippleButtonIcon
                  rippleColor={Colors.dark.ripple}
                  onPress={onRightPress}
                >
                  <MaterialIcons
                    name="chevron-right"
                    size={32}
                    color={iconColor}
                  />
                </RippleButtonIcon>
              </Animated.View>
            )}
          </View>
        </View>
        <ThemedView>
          <ImageBackground
            contentPosition={"bottom"}
            style={[styles.weatherBg]}
            // source={weatherTheme.asset}
          >
            <CurrentWeatherInfo />
          </ImageBackground>
          <View>
            <ListHourly />

            <ThemedView paddingHorizontal={12}>
              <ThemedText uppercase type="subtitle">
                life
              </ThemedText>
            </ThemedView>
            {/* <View>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <View style={[styles.box, styles.centered]}>
                  <ThemedText>Độ ẩm</ThemedText>
                  <ThemedText>54%</ThemedText>
                </View>
                <View style={[styles.centered, styles.box, styles.boxRight]}>
                  <ThemedText>Độ ẩm</ThemedText>
                  <ThemedText>54%</ThemedText>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <View style={[styles.centered, styles.box, styles.boxBottom]}>
                  <ThemedText>Độ ẩm</ThemedText>
                  <ThemedText>54%</ThemedText>
                </View>
                <View
                  style={[
                    styles.centered,
                    styles.box,
                    styles.boxRight,
                    styles.boxBottom,
                  ]}
                >
                  <ThemedText>Độ ẩm</ThemedText>
                  <ThemedText>54%</ThemedText>
                </View>
              </View>
            </View> */}

            <View style={[styles.row, { justifyContent: "space-evenly" }]}>
              <View style={[styles.centered]}>
                <HalfCircle />
              </View>
              <View style={[styles.centered, styles.gap_6, styles.tomorrow]}>
                <ThemedText>Tomorrow</ThemedText>
                <View style={[styles.row, styles.centered, styles.gap_6]}>
                  <Feather name="sunrise" size={24} color={iconColor} />
                  <ThemedText>
                    {weatherUtils.formatSunrise(sunriseTomorrow.sunrise)}
                  </ThemedText>
                </View>
                <View style={[styles.row, styles.centered, styles.gap_6]}>
                  <Feather name="sunset" size={24} color={iconColor} />
                  <ThemedText>
                    {weatherUtils.formatSunrise(sunriseTomorrow.sunset)}
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>
        </ThemedView>
      </ScrollView>
    </>
  );
});

const ListHourly = observer(() => {
  const { weatherStore } = useStores();
  const hourly = weatherStore.selectedWeather.hourly.data;

  return (
    <ThemedView>
      <ThemedView paddingHorizontal={12}>
        <ThemedText uppercase type="subtitle">
          Hourly
        </ThemedText>
      </ThemedView>
      <FlatList
        horizontal
        data={hourly}
        keyExtractor={(item) => item.date}
        renderItem={({ item, index }) => {
          return <WeatherHourly item={item} index={index} />;
        }}
      />
    </ThemedView>
  );
});

const WeatherHourly = ({ item, index }: { item: Hourly; index: number }) => {
  const date = new Date(item.date);
  const time = date.toLocaleString("en-ES", { hour12: true, hour: "numeric" });
  const icon = item.icon as keyof typeof weatherIcon;
  const tag = index === 0 ? "Today" : time === "12 AM" ? "Tomorrow" : "";
  return (
    <ThemedView
      padding={6}
      style={[{ paddingLeft: index === 0 ? 12 : 0 }, styles.centered]}
    >
      <ThemedText>{tag}</ThemedText>
      <ThemedText>{time}</ThemedText>
      <Image source={weatherIcon[icon]} style={{ width: 24, height: 24 }} />
      <ThemedText>{weatherUtils.formatCelcius(item.temperature)}</ThemedText>
    </ThemedView>
  );
};

const HalfCircle = () => {
  const { weatherStore } = useStores();
  const width = (Size.screenWidth - 12 * 2) / 2;
  const height = width / 2;
  const radius = width / 4;
  const centerY = width / 2 - 30;
  const startX = width / 4;
  const endX = (width / 4) * 3;
  const circleColor = useThemeColor("placeholder");
  const p = radius * Math.PI;
  const textColor = useThemeColor("text");
  const sunrise = weatherStore.selectedSunrise;
  const period = weatherUtils.periodOfSunriseAndSunset(
    sunrise.results[0].sunrise,
    sunrise.results[0].sunset
  );
  const date = new Date();
  const nowInMunites = date.getHours() * 60 + date.getMinutes();
  const percent =
    (nowInMunites - weatherUtils.convertTo24Hour(sunrise.results[0].sunrise)) /
    period;

  return (
    <View>
      <Svg height={height} width={width}>
        <Path
          d={`M ${startX} ${centerY} A ${radius} ${radius} 0 0 1 ${endX} ${centerY}`}
          fill="transparent"
          stroke={circleColor}
          strokeWidth="4"
        />
        <Path
          d={`M ${startX} ${centerY} A ${radius} ${radius} 0 0 1 ${endX} ${centerY}`}
          fill="transparent"
          stroke={"#FFDE21"}
          strokeWidth="4"
          strokeDasharray={p}
          strokeDashoffset={p * (1 - percent)}
        />

        <TextSvg
          x={startX - 20}
          y={centerY + 20}
          fontSize="14"
          fill={textColor}
        >
          {weatherUtils.formatSunrise(sunrise.results[0].sunrise)}
        </TextSvg>

        <TextSvg x={endX - 20} y={centerY + 20} fontSize="14" fill={textColor}>
          {weatherUtils.formatSunrise(sunrise.results[0].sunset)}
        </TextSvg>
      </Svg>
    </View>
  );
};

const HeaderIcons = memo(function Component({
  onHeaderPress,
  headerIcons,
}: HeaderIconsProps) {
  const { weatherStore } = useStores();
  const rippleColor = useThemeColor("ripple", {
    dark: Colors.dark.ripple,
    light: Colors.dark.ripple,
  });
  // const weather = weatherStore.selectedCurrentWeather.weather[0];

  // const weatherTheme = useWeatherTheme({
  //   iconCode: weather?.icon,
  //   weatherCode: weather?.id,
  // });

  const iconColor = useThemeColor("icon");

  return (
    <ThemedView style={styles.header}>
      {headerIcons.map((icon) => (
        <RippleButtonIcon
          onPress={() => onHeaderPress(icon)}
          key={"header" + icon}
          rippleColor={rippleColor}
        >
          <MaterialIcons name={icon} size={26} color={iconColor} />
        </RippleButtonIcon>
      ))}
    </ThemedView>
  );
});

const CurrentWeatherInfo: React.FC = observer(() => {
  const { weatherStore } = useStores();
  const [controlVisible, setControlVisible] = useState(true);

  const currentWeather = weatherStore.selectedCurrenWeather;

  const iconColor = useThemeColor("icon");

  useEffect(() => {
    if (controlVisible) {
      const timeout = setTimeout(() => {
        setControlVisible(false);
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [controlVisible]);

  const onLeftPress = useCallback(() => {
    weatherStore.updateSelectedPlace("decrease");
  }, [weatherStore]);

  const onRightPress = useCallback(() => {
    weatherStore.updateSelectedPlace("increase");
  }, [weatherStore]);

  const onSwipe = useCallback(
    (e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      if (e.translationX < -50) {
        onRightPress();
      } else if (e.translationX > 50) {
        onLeftPress();
      }
    },
    [onLeftPress, onRightPress]
  );

  const pan = Gesture.Pan()
    .onTouchesDown((e) => {
      if (!controlVisible) {
        setControlVisible(true);
      }
    })
    .onEnd(onSwipe)
    .runOnJS(true);

  const cloudCover = `Cloud cover ${currentWeather.cloud_cover}%`;
  return (
    <GestureDetector gesture={pan}>
      <View style={styles.current}>
        <ThemedText style={styles.celcius}>
          {weatherUtils.formatCelcius(currentWeather.temperature)}
        </ThemedText>
        <ThemedText color={iconColor}>{currentWeather.summary}</ThemedText>
        <ThemedText type="label" color={iconColor}>
          {cloudCover}
        </ThemedText>
      </View>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  tomorrow: {
    padding: 6,
    borderLeftWidth: 0.5,
    paddingHorizontal: 16,
  },
  row: { flexDirection: "row" },
  gap_6: {
    gap: 6,
  },
  box: {
    flex: 1,
    borderTopWidth: 0.5,
    padding: 18,
  },

  centered: {
    justifyContent: "center",
    alignItems: "center",
  },

  boxRight: {
    borderLeftWidth: 0.5,
  },

  boxBottom: {
    borderBottomWidth: 0.5,
  },
  celcius: {
    fontSize: 66,
    // fontWeight: 200,
    // fontFamily: undefined,
  },
  weatherBg: {
    paddingBottom: 18,
  },
  locationWrapper: {
    alignItems: "center",
    flex: 1,
  },
  navigationWrapper: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
  },
  current: {
    alignItems: "center",
    marginTop: 6,
    width: Size.screenWidth,
    paddingBottom: 80,
  },
  loationName: { flexDirection: "row", gap: 6, alignItems: "center" },
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 18,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
});

export default HomeScreen;
