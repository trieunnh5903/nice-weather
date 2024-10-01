import { Alert, ColorValue, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { observer } from "mobx-react-lite";
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import Units from "@/constants/Units";
import { ImageBackground } from "expo-image";
import { useStores } from "@/hooks/useStore";
import { Device } from "@/constants/Device";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { lightTextColor, useWeatherTheme } from "@/hooks/useWeatherTheme";
import { memo, useCallback, useEffect, useLayoutEffect, useState } from "react";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import RippleButtonIcon from "@/components/RippleButtonIcon";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import * as NavigationBar from "expo-navigation-bar";
import { MaterialIconName } from "@/type";
import { StatusBar } from "expo-status-bar";
import { CommonActions } from "@react-navigation/native";

const HomeScreen: React.FC = observer(() => {
  console.log("home");
  const headerIcons: MaterialIconName[] = ["menu", "add", "delete-outline"];
  const insets = useSafeAreaInsets();
  const { weatherStore } = useStores();
  const weather = weatherStore.selectedCurrentWeather.weather[0];
  const [navigationBarColor, setNavigationBarColor] = useState<ColorValue>();
  const weatherTheme = useWeatherTheme({
    iconCode: weather.icon,
    weatherCode: weather.id,
  });

  // useEffect(() => {
  //   const getNavigationBarColor = async () => {
  //     const color = await NavigationBar.getBackgroundColorAsync();
  //     setNavigationBarColor(color);
  //   };
  //   if (weatherTheme) {
  //     getNavigationBarColor();
  //     NavigationBar.setBackgroundColorAsync(weatherTheme.backgroundColor);
  //   }
  //   return () => {
  //     if (navigationBarColor) {
  //       NavigationBar.setBackgroundColorAsync(navigationBarColor);
  //     }
  //   };
  // }, [navigationBarColor, weatherTheme]);
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
              if (weatherStore.allProvinceIds.length === 1) {
                navigation.dispatch(
                  CommonActions.reset({
                    routes: [{ name: "index", key: "index" }],
                  })
                );
                weatherStore.deleteProvince(weatherStore.selectedProvinceId);
              } else {
                weatherStore.deleteProvince(weatherStore.selectedProvinceId);
              }
            },
          },
        ]);
        break;
      default:
        break;
    }
  };

  if (!weatherTheme) {
    return;
  }

  return (
    <>
      <StatusBar
        style={weatherTheme.textColor === lightTextColor ? "light" : "dark"}
      />
      <ThemedView
        style={{ flex: 1, backgroundColor: weatherTheme.backgroundColor }}
      >
        <ImageBackground
          contentPosition={"bottom"}
          style={[{ paddingTop: insets.top }, styles.weatherBg]}
          source={weatherTheme.asset}
        >
          <HeaderIcons
            headerIcons={headerIcons}
            onHeaderPress={onHeaderPress}
          />
          <CurrentWeatherInfo />
        </ImageBackground>
      </ThemedView>
    </>
  );
});

interface HeaderIconsProps {
  onHeaderPress: (icon: string) => void;
  headerIcons: MaterialIconName[];
}
const HeaderIcons = memo(function Component({
  onHeaderPress,
  headerIcons,
}: HeaderIconsProps) {
  const { weatherStore } = useStores();
  const rippleColor = useThemeColor("ripple", {
    dark: Colors.dark.ripple,
    light: Colors.dark.ripple,
  });
  const weather = weatherStore.selectedCurrentWeather.weather[0];

  const weatherTheme = useWeatherTheme({
    iconCode: weather?.icon,
    weatherCode: weather?.id,
  });

  return (
    <View style={styles.header}>
      {headerIcons.map((icon) => (
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
      ))}
    </View>
  );
});

const CurrentWeatherInfo: React.FC = observer(() => {
  const { weatherStore } = useStores();
  const [controlVisible, setControlVisible] = useState(true);
  const weather = weatherStore.selectedCurrentWeather;
  const weatherDetails = weather.weather[0];
  const province = weatherStore.selectedProvince;
  const provinceName =
    province.local_names?.vi || province.local_names?.en || province.name;
  const temperature = Math.round(weather.main.temp);
  const tempRealFeel = Math.round(weather.main.feels_like);
  const weatherTheme = useWeatherTheme({
    iconCode: weatherDetails.icon,
    weatherCode: weatherDetails.id,
  });
  const iconColor = weatherTheme?.textColor;

  useEffect(() => {
    if (controlVisible) {
      const timeout = setTimeout(() => {
        setControlVisible(false);
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [controlVisible]);

  const onLeftPress = useCallback(() => {
    weatherStore.updateSelectedProvince("decrease");
  }, [weatherStore]);

  const onRightPress = useCallback(() => {
    weatherStore.updateSelectedProvince("increase");
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

  return (
    <GestureDetector gesture={pan}>
      <View style={styles.current}>
        <View style={styles.navigationWrapper}>
          {controlVisible && (
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
              {province.isUserLocation && (
                <MaterialIcons name="location-on" size={16} color={iconColor} />
              )}
              <ThemedText color={iconColor}>{provinceName}</ThemedText>
            </View>
            <ThemedText color={iconColor}>{`${weatherStore.selectedIndex + 1}/${
              weatherStore.allProvinceIds.length
            }`}</ThemedText>
          </View>

          {controlVisible && (
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
        <ThemedText
          style={styles.celcius}
          type="defaultLight"
          color={iconColor}
        >
          {temperature + Units.Celsius}
        </ThemedText>
        <ThemedText color={iconColor} type="defaultBold">
          {weatherDetails.main}
        </ThemedText>
        <ThemedText color={iconColor}>
          Feels like {tempRealFeel + Units.Celsius}
        </ThemedText>
        <ThemedText color={iconColor}>{weatherDetails.description}</ThemedText>
      </View>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  celcius: {
    fontSize: 76,
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
    height: 60,
  },
  current: {
    alignItems: "center",
    marginTop: 6,
    width: Device.screenWidth,
  },
  loationName: { flexDirection: "row", gap: 6, alignItems:'center' },
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
