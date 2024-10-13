import { Alert, StyleSheet, ScrollView, Appearance } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { Observer, observer } from "mobx-react-lite";
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { Image } from "expo-image";
import { useStores } from "@/hooks/useStore";
import { memo, useCallback, useEffect, useMemo } from "react";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import RippleButtonIcon from "@/components/RippleButtonIcon";
import { Colors } from "@/constants/Colors";
import { Daily, Hourly, MaterialIconName } from "@/type";
import { CommonActions } from "@react-navigation/native";
import { Path, Svg, Text as TextSvg } from "react-native-svg";
import { Size } from "@/constants/Size";
import weatherUtils from "@/utils/weatherUtils";
import weatherIcon from "@/config/weatherIcon";
import {
  LineChart,
  lineDataItem,
  yAxisSides,
} from "react-native-gifted-charts";
import { useSunriseSelected, useWeatherSelected } from "@/hooks/useWeatherData";

import { MenuView } from "@react-native-menu/menu";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ActivityIndicator } from "react-native-paper";
interface HeaderIconsProps {
  onHeaderPress: (icon: string) => void;
  headerIcons: MaterialIconName[];
}

interface WeatherHourlyProps {
  item: Hourly;
  index: number;
  width: number;
  nextDayIndex: number;
  currentTimeIndex: number;
}
interface WeatherDailyProps {
  item: Daily;
  index: number;
  width: number;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

const HomeScreen: React.FC = () => {
  console.log("home");
  const headerIcons: MaterialIconName[] = ["menu", "add", "delete-outline"];
  const { weatherStore } = useStores();
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
              if (weatherStore.places.length === 1) {
                navigation.dispatch(
                  CommonActions.reset({
                    routes: [{ name: "index", key: "index" }],
                  })
                );
              }
              weatherStore.deletePlace(weatherStore.selectedPlace.place_id);
            },
          },
        ]);
        break;
      default:
        break;
    }
  };

  return (
    <ThemedView flex enableInsetsTop>
      <ScrollView stickyHeaderIndices={[0]}>
        <ThemedView>
          <HeaderIcons
            headerIcons={headerIcons}
            onHeaderPress={onHeaderPress}
          />
          <PlaceNavigation />
        </ThemedView>
        <ThemedView>
          <ThemedView paddingBottom={18}>
            <CurrentWeatherInfo />
          </ThemedView>
          <ThemedView>
            <ListHourly />
            <ThemedView paddingTop={12}>
              <ListDaily />
            </ThemedView>
            <ThemedView paddingTop={12}>
              <Sunrise />
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
};

const PlaceNavigation = () => {
  const { weatherStore } = useStores();
  const themeColor = useAppTheme();
  const iconColor = themeColor.icon;

  console.log("PlaceNavigation");

  const onLeftPress = useCallback(() => {
    weatherStore.updateSelectedPlace("decrease");
  }, [weatherStore]);

  const onRightPress = useCallback(() => {
    weatherStore.updateSelectedPlace("increase");
  }, [weatherStore]);
  return (
    <ThemedView style={styles.navigationWrapper}>
      <ThemedView>
        <RippleButtonIcon
          rippleColor={Colors.dark.ripple}
          onPress={onLeftPress}
        >
          <MaterialIcons name="chevron-left" size={32} color={iconColor} />
        </RippleButtonIcon>
      </ThemedView>

      <Observer>
        {() => (
          <ThemedView style={styles.locationWrapper}>
            <ThemedView style={styles.loationName}>
              {weatherStore.selectedPlace.isUserLocation && (
                <MaterialIcons name="location-on" size={16} color={iconColor} />
              )}
              <ThemedText color={iconColor}>
                {weatherStore.selectedPlace.name}
              </ThemedText>
            </ThemedView>
            <ThemedText color={iconColor}>{`${weatherStore.selectedIndex + 1}/${
              weatherStore.places.length
            }`}</ThemedText>
          </ThemedView>
        )}
      </Observer>
      <ThemedView>
        <RippleButtonIcon
          rippleColor={Colors.dark.ripple}
          onPress={onRightPress}
        >
          <MaterialIcons name="chevron-right" size={32} color={iconColor} />
        </RippleButtonIcon>
      </ThemedView>
    </ThemedView>
  );
};

const ListDaily = observer(() => {
  const weatherItemWidth = 90;
  const themeColor = useAppTheme();
  const textColor = themeColor.text;
  const daily = useWeatherSelected()?.daily.data;

  const { tempMaxData, tempMinData } = useMemo(() => {
    if (!daily || daily.length === 0) {
      return {
        tempMaxData: [],
        tempMinData: [],
      };
    }

    let tempMaxData: lineDataItem[] = [];
    let tempMinData: lineDataItem[] = [];

    daily.forEach((item) => {
      const tempMaxValue = Math.round(item.all_day.temperature_max);
      const tempMinValue = Math.round(item.all_day.temperature_min);

      tempMaxData.push({
        value: tempMaxValue,
        dataPointText: weatherUtils.formatTemperatureWithoutUnit(tempMaxValue),
      });
      tempMinData.push({
        value: tempMinValue,
        dataPointText: weatherUtils.formatTemperatureWithoutUnit(tempMinValue),
      });
    });

    return {
      tempMaxData,
      tempMinData,
    };
  }, [daily]);
  if (!daily || daily.length === 0) return null;
  return (
    <ThemedView>
      <ThemedView paddingHorizontal={12}>
        <ThemedText uppercase type="subtitle">
          daily
        </ThemedText>
      </ThemedView>
      <ScrollView showsHorizontalScrollIndicator={false} horizontal>
        <ThemedView>
          {
            <ThemedView style={styles.row}>
              {daily.map((item, index) => {
                return (
                  <WeatherDaily
                    key={item.day}
                    item={item}
                    index={index}
                    width={weatherItemWidth}
                  />
                );
              })}
            </ThemedView>
          }
          <ThemedView paddingTop={13}>
            <LineChart
              yAxisSide={yAxisSides.RIGHT}
              disableScroll
              data={tempMaxData}
              adjustToWidth
              textFontSize={13}
              textShiftY={-6}
              color={textColor}
              dataPointsColor={textColor}
              textShiftX={-6}
              trimYAxisAtTop
              initialSpacing={weatherItemWidth / 2}
              textColor={textColor}
              spacing={weatherItemWidth}
              isAnimated
              hideAxesAndRules
              xAxisLabelsHeight={0}
              overflowTop={10}
              animateOnDataChange
              height={30}
            />
          </ThemedView>
          <ThemedView paddingTop={13}>
            <LineChart
              yAxisSide={yAxisSides.RIGHT}
              disableScroll
              color={textColor}
              dataPointsColor={textColor}
              data={tempMinData}
              adjustToWidth
              textFontSize={13}
              textShiftY={-6}
              textShiftX={-6}
              trimYAxisAtTop
              initialSpacing={weatherItemWidth / 2}
              textColor={textColor}
              spacing={weatherItemWidth}
              isAnimated
              hideAxesAndRules
              animateOnDataChange
              xAxisLabelsHeight={0}
              overflowTop={10}
              height={30}
            />
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
});

const ListHourly = observer(() => {
  const weatherItemWidth = 70;
  const themeColor = useAppTheme();
  const textColor = themeColor.text;
  const hourly = useWeatherSelected()?.hourly.data;
  const sunrise = useSunriseSelected();
  const { chartData, nextDayIndex, currentTimeIndex } = useMemo(() => {
    if (!hourly || hourly.length === 0)
      return {
        chartData: [],
        nextDayIndex: 0,
        currentTimeIndex: 0,
      };
    const chartData = hourly.map((item) => ({
      value: Math.round(item.temperature),
      dataPointText: weatherUtils.formatTemperatureWithoutUnit(
        item.temperature
      ),
    }));

    const now = new Date(hourly[0].date);
    const nextDayIndex = hourly.findIndex((item) => {
      const date = new Date(item.date);
      return now.getHours() > date.getHours();
    });

    const hour = new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      timeZone: sunrise?.[0].timezone,
    });
    const currentTimeIndex = hourly.findIndex((item) => {
      const date = new Date(item.date);
      return hour === date.getHours().toString();
    });

    return {
      chartData,
      nextDayIndex,
      currentTimeIndex: Math.max(0, currentTimeIndex),
    };
  }, [hourly, sunrise]);

  if (!hourly || hourly.length === 0) return;

  return (
    <ThemedView>
      <ThemedView paddingHorizontal={12}>
        <ThemedText uppercase type="subtitle">
          Hourly
        </ThemedText>
      </ThemedView>
      <ScrollView showsHorizontalScrollIndicator={false} horizontal>
        <ThemedView>
          {
            <ThemedView style={styles.row}>
              {hourly.map((item, index) => {
                return (
                  <WeatherHourly
                    key={item.date}
                    item={item}
                    index={index}
                    width={weatherItemWidth}
                    nextDayIndex={nextDayIndex}
                    currentTimeIndex={currentTimeIndex}
                  />
                );
              })}
            </ThemedView>
          }

          <ThemedView paddingTop={13}>
            <LineChart
              yAxisSide={yAxisSides.RIGHT}
              disableScroll
              data={chartData}
              adjustToWidth
              textFontSize={13}
              textShiftY={-6}
              textShiftX={-6}
              color={textColor}
              dataPointsColor={textColor}
              trimYAxisAtTop
              initialSpacing={weatherItemWidth / 2}
              textColor={textColor}
              spacing={weatherItemWidth}
              isAnimated
              hideAxesAndRules
              xAxisLabelsHeight={0}
              overflowTop={10}
              animateOnDataChange
              height={50}
            />
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
});

const WeatherDaily = ({ index, item, width }: WeatherDailyProps) => {
  const icon = item.icon as keyof typeof weatherIcon;
  const day = weatherUtils.getDay(item.day);
  const tag =
    index === 0 ? "Today" : day === weatherUtils.days[1] ? "Next week" : "";
  return (
    <ThemedView style={styles.centered}>
      <ThemedText type="label">{tag}</ThemedText>
      <ThemedView
        padding={6}
        paddingTop={0}
        style={[{ width }, styles.centered]}
      >
        <ThemedText>{day}</ThemedText>
        <Image source={weatherIcon[icon]} style={{ width: 24, height: 24 }} />
        <ThemedView style={[styles.row, styles.centered]}>
          <Image source={weatherIcon[7]} style={{ width: 16, height: 16 }} />
          <ThemedView paddingLeft={2}>
            <ThemedText fontSize={12}>
              {item.all_day.cloud_cover.total}%
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

const WeatherHourly = ({
  item,
  index,
  width,
  nextDayIndex,
  currentTimeIndex,
}: WeatherHourlyProps) => {
  const date = new Date(item.date);
  const time = date.toLocaleString("en-ES", { hour12: true, hour: "numeric" });
  const icon = item.icon as keyof typeof weatherIcon;
  const tag =
    index === currentTimeIndex
      ? "Today"
      : index === nextDayIndex
      ? "Tomorrow"
      : "";
  return (
    <ThemedView style={styles.centered}>
      <ThemedText type="label">{tag}</ThemedText>
      <ThemedView
        padding={6}
        style={[{ width, paddingTop: 0 }, styles.centered]}
      >
        <ThemedText>{time}</ThemedText>
        <Image source={weatherIcon[icon]} style={{ width: 24, height: 24 }} />
        <ThemedView style={[styles.row, styles.centered]}>
          <Image source={weatherIcon[7]} style={{ width: 16, height: 16 }} />
          <ThemedView paddingLeft={2}>
            <ThemedText fontSize={12}>{item.cloud_cover.total}%</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

const Sunrise = observer(() => {
  const themeColor = useAppTheme();
  const iconColor = themeColor.icon;
  const data = useSunriseSelected();
  if (!data) return null;
  const today = data[0];
  const tomorrow = data[1];
  const now = new Date().toLocaleString("en-US", {
    timeZone: today.timezone,
    hour: "2-digit",
    minute: "2-digit",
  });

  const currentTimeInPercent =
    (weatherUtils.convertToMinute(now) -
      weatherUtils.convertToMinute(today.sunrise)) /
    (weatherUtils.convertToMinute(today.sunset) -
      weatherUtils.convertToMinute(today.sunrise));

  return (
    <ThemedView>
      <ThemedView paddingHorizontal={12}>
        <ThemedText uppercase type="subtitle">
          life
        </ThemedText>
      </ThemedView>
      <ThemedView style={[styles.row, { justifyContent: "space-evenly" }]}>
        <ThemedView style={[styles.centered]}>
          <SunriseChart currentTimeInPercent={currentTimeInPercent} />
        </ThemedView>
        <ThemedView
          style={[
            styles.centered,
            styles.gap_6,
            styles.tomorrow,
            { borderColor: iconColor },
          ]}
        >
          <ThemedText>Tomorrow</ThemedText>
          <ThemedView style={[styles.row, styles.centered, styles.gap_6]}>
            <Feather name="sunrise" size={24} color={iconColor} />
            <ThemedText>
              {weatherUtils.formatSunrise(tomorrow.sunrise)}
            </ThemedText>
          </ThemedView>
          <ThemedView style={[styles.row, styles.centered, styles.gap_6]}>
            <Feather name="sunset" size={24} color={iconColor} />
            <ThemedText>
              {weatherUtils.formatSunrise(tomorrow.sunset)}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
});

const SunriseChart = ({
  currentTimeInPercent,
}: {
  currentTimeInPercent: number;
}) => {
  const width = (Size.screenWidth - 12 * 2) / 2;
  const height = width / 2;
  const radius = width / 4;
  const centerY = width / 2 - 30;
  const startX = width / 4;
  const endX = (width / 4) * 3;
  const p = radius * Math.PI;
  const strokeDashoffset = useSharedValue(p);
  const themeColor = useAppTheme();
  const bacgroundColor = themeColor.placeholder;
  const textColor = themeColor.text;
  useEffect(() => {
    if (currentTimeInPercent < 1) {
      strokeDashoffset.value = withTiming(p * (1 - currentTimeInPercent), {
        duration: 1000,
      });
    } else {
      strokeDashoffset.value = withTiming(p, {
        duration: 1000,
      });
    }
  }, [currentTimeInPercent, p, strokeDashoffset]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: strokeDashoffset.value,
  }));

  const data = useSunriseSelected();

  if (!data) {
    return null;
  }

  return (
    <Svg height={height} width={width}>
      <Path
        d={`M ${startX} ${centerY} A ${radius} ${radius} 0 0 1 ${endX} ${centerY}`}
        fill="transparent"
        stroke={bacgroundColor}
        strokeWidth="4"
      />
      <AnimatedPath
        d={`M ${startX} ${centerY} A ${radius} ${radius} 0 0 1 ${endX} ${centerY}`}
        fill="transparent"
        stroke={"#FFDE21"}
        strokeWidth="4"
        strokeDasharray={p}
        animatedProps={animatedProps}
      />
      <TextSvg x={startX - 20} y={centerY + 20} fontSize="14" fill={textColor}>
        {weatherUtils.formatSunrise(data[0].sunrise)}
      </TextSvg>
      <TextSvg x={endX - 20} y={centerY + 20} fontSize="14" fill={textColor}>
        {weatherUtils.formatSunrise(data[0].sunset)}
      </TextSvg>
    </Svg>
  );
};

const HeaderIcons = memo(function Component({
  onHeaderPress,
  headerIcons,
}: HeaderIconsProps) {
  const themeColor = useAppTheme();
  const iconColor = themeColor.icon;

  const queryClient = useQueryClient();
  return (
    <ThemedView style={styles.header}>
      {headerIcons.map((icon) => (
        <RippleButtonIcon
          onPress={() => onHeaderPress(icon)}
          key={"header" + icon}
        >
          <MaterialIcons name={icon} size={26} color={iconColor} />
        </RippleButtonIcon>
      ))}
      <MenuView
        onPressAction={({ nativeEvent }) => {
          if (nativeEvent.event === "update") {
            queryClient.invalidateQueries();
          } else if (nativeEvent.event === "setting") {
            router.navigate("/setting");
          }
        }}
        actions={[
          {
            id: "update",
            title: "Update now",
          },
          {
            id: "setting",
            title: "Setting",
          },
        ]}
        shouldOpenOnLongPress={false}
      >
        <RippleButtonIcon>
          <MaterialCommunityIcons
            name={"dots-vertical"}
            size={26}
            color={iconColor}
          />
        </RippleButtonIcon>
      </MenuView>
    </ThemedView>
  );
});

const CurrentWeatherInfo: React.FC = observer(() => {
  const { weatherStore } = useStores();
  const weather = useWeatherSelected();
  const themeColor = useAppTheme();
  const iconColor = themeColor.icon;
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

  const pan = Gesture.Pan().onEnd(onSwipe).runOnJS(true);
  if (!weather) return;
  const cloudCover = `Cloud cover ${weather.current.cloud_cover}%`;
  return (
    <GestureDetector gesture={pan}>
      <ThemedView style={styles.current}>
        <ThemedText style={styles.celcius}>
          {weather.units === "metric"
            ? weatherUtils.formatCelcius(weather.current.temperature)
            : weatherUtils.formatFahrenheit(weather.current.temperature)}
        </ThemedText>
        <ThemedText color={iconColor}>{weather.current.summary}</ThemedText>
        <ThemedText color={iconColor}>{cloudCover}</ThemedText>
        <DataStatus />
      </ThemedView>
    </GestureDetector>
  );
});

const DataStatus = () => {
  // const { weatherStore } = useStores();
  // const queryClient = useQueryClient();
  const isFetching = useIsFetching();
  // const dataUpdatedAt = queryClient.getQueryState([
  //   "weather",
  //   weatherStore.selectedPlace.place_id,
  // ])?.dataUpdatedAt;
  // if (!dataUpdatedAt) return null;
  const date = new Date().toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isFetching)
    return (
      <ThemedView style={styles.row}>
        <ActivityIndicator size={12} />
        <ThemedView paddingLeft={6}>
          <ThemedText type="label">Updating...</ThemedText>
        </ThemedView>
      </ThemedView>
    );

  return <ThemedText type="label">Updated at {date}</ThemedText>;
};

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
    fontSize: 70,
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
    // paddingBottom: 80,
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
    alignItems: "center",
  },
});

export default HomeScreen;
