import { Alert, StyleSheet, ScrollView } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { Observer, observer } from "mobx-react-lite";
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { Image, ImageBackground } from "expo-image";
import { useStores } from "@/hooks/useStore";
import { memo, useCallback, useEffect, useState } from "react";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import RippleButtonIcon from "@/components/RippleButtonIcon";
import { useThemeColor } from "@/hooks/useThemeColor";
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
interface HeaderIconsProps {
  onHeaderPress: (icon: string) => void;
  headerIcons: MaterialIconName[];
}

interface WeatherHourlyProps {
  item: Hourly;
  index: number;
  width: number;
  nextDayIndex: number;
}
interface WeatherDailyProps {
  item: Daily;
  index: number;
  width: number;
}
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
              if (weatherStore.allPlaceIds.length === 1) {
                navigation.dispatch(
                  CommonActions.reset({
                    routes: [{ name: "index", key: "index" }],
                  })
                );
              }
              weatherStore.deletePlace(weatherStore.selectedPlaceId);
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
  const iconColor = useThemeColor("icon");

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
              weatherStore.allPlaceIds.length
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

const ListDaily = () => {
  const weatherItemWidth = 90;
  const { weatherStore } = useStores();
  const textColor = useThemeColor("text");
  const daily = weatherStore.selectedWeather.daily.data;
  const tempMaxData: lineDataItem[] = daily.map((item) => ({
    value: Math.round(item.all_day.temperature_max),
    dataPointText: Math.round(item.all_day.temperature_max).toString(),
  }));

  const minTemperature = Math.min(...tempMaxData.map((item) => item.value));
  const maxTemperature = Math.max(...tempMaxData.map((item) => item.value));

  const tempMinData: lineDataItem[] = daily.map((item) => ({
    value: Math.round(item.all_day.temperature_min),
    dataPointText: Math.round(item.all_day.temperature_min).toString(),
  }));
  const minTemperature2 = Math.min(...tempMinData.map((item) => item.value));
  const maxTemperature2 = Math.max(...tempMinData.map((item) => item.value));
  const noOfSections2 = maxTemperature2 - minTemperature2 + 1;
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
              noOfSections={2}
              maxValue={maxTemperature - minTemperature + 1}
              yAxisOffset={minTemperature}
              stepHeight={10}
            />
          </ThemedView>
          <ThemedView paddingTop={13}>
            <LineChart
              yAxisSide={yAxisSides.RIGHT}
              disableScroll
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
              noOfSections={noOfSections2}
              maxValue={maxTemperature2 - minTemperature2 + 1}
              yAxisOffset={minTemperature2}
              stepHeight={10}
            />
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
};

const ListHourly = observer(() => {
  const weatherItemWidth = 70;
  const { weatherStore } = useStores();
  const hourly = weatherStore.selectedWeather.hourly.data;
  const textColor = useThemeColor("text");
  const temperatures: number[] = [];
  const chartData = hourly.map((item) => {
    temperatures.push(item.temperature);
    return {
      value: Math.round(item.temperature),
      dataPointText: weatherUtils.formatCelciusWithoutUnit(item.temperature),
    };
  });
  const minTemperature = Math.min(...temperatures);
  const maxTemperature = Math.max(...temperatures);
  const now = new Date(hourly[0].date);
  const nextDayIndex = hourly.findIndex((item) => {
    const date = new Date(item.date);
    return now.getHours() > date.getHours();
  });

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
              trimYAxisAtTop
              initialSpacing={weatherItemWidth / 2}
              textColor={textColor}
              spacing={weatherItemWidth}
              isAnimated
              hideAxesAndRules
              xAxisLabelsHeight={0}
              overflowTop={10}
              animateOnDataChange
              noOfSections={4}
              maxValue={maxTemperature - minTemperature + 1}
              yAxisOffset={minTemperature}
              stepHeight={10}
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
            <ThemedText>{item.all_day.cloud_cover.total}%</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

const Sunrise = () => {
  const { weatherStore } = useStores();
  const iconColor = useThemeColor("icon");
  const sunriseTomorrow = weatherStore.selectedSunrise.results[1];
  return (
    <ThemedView>
      <ThemedView paddingHorizontal={12}>
        <ThemedText uppercase type="subtitle">
          life
        </ThemedText>
      </ThemedView>
      <ThemedView style={[styles.row, { justifyContent: "space-evenly" }]}>
        <ThemedView style={[styles.centered]}>
          <HalfCircle />
        </ThemedView>
        <ThemedView style={[styles.centered, styles.gap_6, styles.tomorrow]}>
          <ThemedText>Tomorrow</ThemedText>
          <ThemedView style={[styles.row, styles.centered, styles.gap_6]}>
            <Feather name="sunrise" size={24} color={iconColor} />
            <ThemedText>
              {weatherUtils.formatSunrise(sunriseTomorrow.sunrise)}
            </ThemedText>
          </ThemedView>
          <ThemedView style={[styles.row, styles.centered, styles.gap_6]}>
            <Feather name="sunset" size={24} color={iconColor} />
            <ThemedText>
              {weatherUtils.formatSunrise(sunriseTomorrow.sunset)}
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
}: WeatherHourlyProps) => {
  const date = new Date(item.date);
  const time = date.toLocaleString("en-ES", { hour12: true, hour: "numeric" });
  const icon = item.icon as keyof typeof weatherIcon;
  const tag = index === 0 ? "Today" : index === nextDayIndex ? "Tomorrow" : "";
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
            <ThemedText>{item.cloud_cover.total}%</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
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
  const p = radius * Math.PI;
  const circleColor = useThemeColor("placeholder");
  const textColor = useThemeColor("text");
  const sunrise = weatherStore.selectedSunrise;
  const period = weatherUtils.periodOfSunriseAndSunset(
    sunrise.results[0].sunrise,
    sunrise.results[0].sunset
  );

  const date = new Date();

  const now = date.toLocaleString("en-US", {
    timeZone: sunrise.results[0].timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const percent =
    (weatherUtils.convertToMinute(now) -
      weatherUtils.convertToMinute(sunrise.results[0].sunrise)) /
    period;

  return (
    <ThemedView>
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
          strokeDashoffset={percent < 1 ? p * (1 - percent) : p}
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
    </ThemedView>
  );
};

const HeaderIcons = memo(function Component({
  onHeaderPress,
  headerIcons,
}: HeaderIconsProps) {
  const rippleColor = useThemeColor("ripple", {
    dark: Colors.dark.ripple,
    light: Colors.dark.ripple,
  });

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

  const currentWeather = weatherStore.selectedCurrenWeather;

  const iconColor = useThemeColor("icon");

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
  const cloudCover = `Cloud cover ${currentWeather.cloud_cover}%`;
  return (
    <GestureDetector gesture={pan}>
      <ThemedView style={styles.current}>
        <ThemedText style={styles.celcius}>
          {weatherUtils.formatCelcius(currentWeather.temperature)}
        </ThemedText>
        <ThemedText color={iconColor}>{currentWeather.summary}</ThemedText>
        <ThemedText type="label" color={iconColor}>
          {cloudCover}
        </ThemedText>
      </ThemedView>
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
  },
});

export default HomeScreen;
