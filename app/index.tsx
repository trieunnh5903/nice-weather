import { Alert, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { observer } from "mobx-react-lite";
import weatherStore from "@/stores/weatherStore";
import {
  Gesture,
  GestureDetector,
  TouchableOpacity,
} from "react-native-gesture-handler";
import Units from "@/constants/Units";
import { MaterialIconName } from "@/type";
import { Image, ImageBackground } from "expo-image";
import weatherIconMapping from "@/config/weatherIconMapping";
import { useStores } from "@/hooks/useStore";
import { Device } from "@/constants/Device";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { lightTextColor, useWeatherTheme } from "@/hooks/useWeatherTheme";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import Animated, {
  FadeIn,
  FadeOut,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { setStatusBarStyle } from "expo-status-bar";
import RippleButtonIcon from "@/components/RippleButtonIcon";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";

const HomeScreen: React.FC = observer(() => {
  const headerIcons: MaterialIconName[] = ["menu", "add", "delete-outline"];
  const insets = useSafeAreaInsets();
  const { currWeatherStore } = useStores();
  const weather =
    currWeatherStore.currentWeather[weatherStore.selectedWeather].weather[0];
  const weatherTheme = useWeatherTheme({
    iconCode: weather.icon,
    weatherCode: weather.id,
  });
  const prevColor = useRef(weatherTheme?.backgroundColor);
  const rippleColor = useThemeColor(
    {
      dark: Colors.dark.ripple,
      light: Colors.dark.ripple,
    },
    "ripple"
  );
  useFocusEffect(() => {
    setStatusBarStyle(
      weatherTheme?.textColor === lightTextColor ? "light" : "dark"
    );
    return () => {
      setStatusBarStyle("auto");
    };
  });

  useEffect(() => {
    prevColor.current = weatherTheme?.backgroundColor;
  }, [weatherTheme?.backgroundColor]);

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
              weatherStore.deleteCurrentWeather(
                currWeatherStore.currentWeather[weatherStore.selectedWeather]
                  .location
              );
            },
          },
        ]);
        break;
      default:
        break;
    }
  };

  // useEffect(() => {
  //   const disposer = autorun(() => {
  //     console.log(
  //       "currentWeather",
  //       JSON.stringify(weatherStore.currentWeather)
  //     );
  //   });
  //   return disposer();
  // }, []);

  return (
    <ThemedView
      style={{ flex: 1, backgroundColor: weatherTheme?.backgroundColor }}
    >
      <ImageBackground
        transition={1000}
        contentPosition={"bottom"}
        style={[{ paddingTop: insets.top }, styles.weatherBg]}
        source={weatherTheme && weatherTheme.asset.localUri}
      >
        <View style={styles.header}>
          {headerIcons.map((icon) => {
            return (
              <RippleButtonIcon
                onPress={() => onHeaderPress(icon)}
                key={"header" + icon}
                rippleColor={rippleColor}
              >
                <MaterialIcons
                  name={icon}
                  size={26}
                  color={weatherTheme?.textColor}
                />
              </RippleButtonIcon>
            );
          })}
          {/* <MaterialCommunityIcons
            name="dots-vertical"
            size={24}
            color={weatherTheme?.textColor}
          /> */}
        </View>

        <CurrentWeather />
      </ImageBackground>
    </ThemedView>
  );
});

const CurrentWeather: React.FC = observer(() => {
  const { currWeatherStore } = useStores();
  const rippleColor = useThemeColor(
    {
      dark: Colors.dark.ripple,
      light: Colors.dark.ripple,
    },
    "ripple"
  );
  const weather = currWeatherStore.currentWeather[weatherStore.selectedWeather];
  const locationName =
    weather?.location.local_names?.vi ||
    weather?.location.local_names?.en ||
    weather?.location.name;
  const mainWeather = weather?.weather[0]?.main;
  const temperature = Math.round(weather?.main.temp);
  const tempRealFeel = Math.round(weather?.main.feels_like);
  const description = weather?.weather[0].description;
  const iconCode = weather.weather[0].icon as keyof typeof weatherIconMapping;
  const weatherTheme = useWeatherTheme({
    iconCode: iconCode,
    weatherCode: weather.id,
  });
  const iconColor = weatherTheme?.textColor;
  const [controlVisible, setControlVisible] = useState(true);
  useEffect(() => {
    if (controlVisible) {
      const timeout = setTimeout(() => {
        setControlVisible(false);
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [controlVisible]);

  const onLeftPress = () => {
    currWeatherStore.updateSelectedWeather("decrease");
  };

  const onRightPress = () => {
    currWeatherStore.updateSelectedWeather("increase");
  };
  const pan = Gesture.Pan()
    .onTouchesDown((e) => {
      if (!controlVisible) {
        setControlVisible(true);
      }
    })
    .onEnd((e) => {
      if (e.translationX < -50) {
        onRightPress();
      } else if (e.translationX > 50) {
        onLeftPress();
      }
    })
    .runOnJS(true);

  return (
    <GestureDetector gesture={pan}>
      <View style={styles.current}>
        <View style={styles.locationWrapper}>
          {/* button group */}
          <View style={styles.navigationWrapper}>
            {controlVisible && (
              <Animated.View entering={FadeIn} exiting={FadeOut}>
                <RippleButtonIcon
                  rippleColor={rippleColor}
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

            <View style={{ alignItems: "center" }}>
              <View style={styles.loationName}>
                <MaterialIcons name="location-on" size={24} color={iconColor} />
                <ThemedText color={iconColor}>{locationName}</ThemedText>
              </View>
              <ThemedText color={iconColor}>{`${
                weatherStore.selectedWeather + 1
              }/${currWeatherStore.currentWeather.length}`}</ThemedText>
            </View>
            {controlVisible && (
              <Animated.View entering={FadeIn} exiting={FadeOut}>
                <RippleButtonIcon onPress={onRightPress}>
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
        <ThemedText style={styles.celcius} color={iconColor}>
          {temperature + Units.Celsius}
        </ThemedText>
        <ThemedText color={iconColor} type="defaultBold">
          {mainWeather}
        </ThemedText>
        <ThemedText color={iconColor} type="label">
          Feels like {tempRealFeel + Units.Celsius}
        </ThemedText>
        <ThemedText color={iconColor} type="label">
          {description}
        </ThemedText>
      </View>
    </GestureDetector>
  );
});

interface AnimatedBackgroundProps extends PropsWithChildren {
  backgroundColor?: string;
  preColor?: string;
}
const AnimatedBackground = ({
  backgroundColor,
  preColor,
  children,
}: AnimatedBackgroundProps) => {
  const sharedBackgroundColor = useSharedValue(0);

  console.log("preColor", preColor);
  console.log("backgroundColor", backgroundColor);
  useEffect(() => {
    console.log("useEffect");
    sharedBackgroundColor.value = 0;
    console.log("sharedBackgroundColor", sharedBackgroundColor.value);
    if (preColor && backgroundColor && preColor !== backgroundColor) {
      sharedBackgroundColor.value = withTiming(1, { duration: 5000 });
    }
  }, [backgroundColor, preColor, sharedBackgroundColor]);

  const animatedStyle = useAnimatedStyle(() => {
    const interpolatedColor =
      backgroundColor &&
      preColor &&
      interpolateColor(
        sharedBackgroundColor.value,
        [0, 1],
        [backgroundColor, preColor]
      );
    return {
      backgroundColor: interpolatedColor,
    };
  });

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  weatherBg: {
    paddingBottom: 18,
  },
  locationWrapper: {
    marginBottom: 12,
    alignItems: "center",
  },
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  current: {
    alignItems: "center",
    marginTop: 6,
    width: Device.screenWidth,
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
    gap: 18,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
});

export default HomeScreen;
