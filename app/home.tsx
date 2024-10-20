import { ThemedView } from "@/components";
import {
  CurrentWeatherInfo,
  HeaderIcons,
  Life,
  ListDaily,
  ListHourly,
  PlaceNavigation,
} from "@/components/home";
import { useStores } from "@/hooks";
import { MaterialIconName } from "@/type";
import { CommonActions } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";
import { useCallback, useMemo, useRef } from "react";
import { Alert, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from "react-native-pager-view";
import { useQueries } from "@tanstack/react-query";
import { queryConfig } from "@/config/queryConfig";
import { observer } from "mobx-react-lite";
import { Size } from "@/constants/Size";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

const HomeScreen: React.FC = observer(() => {
  const pagerRef = useRef<PagerView>(null);
  const { weatherStore } = useStores();
  const navigation = useNavigation();
  const offsetY = useSharedValue(0);
  const headerIcons: MaterialIconName[] = useMemo(
    () => ["menu", "add", "delete-outline"],
    []
  );
  const INPUT_MAX_VALUE = 160;

  const allWeather = useQueries({
    queries: weatherStore.places.map((place) =>
      queryConfig.weatherQueryOptions(
        place.lat,
        place.lon,
        weatherStore.temperatureUnit
      )
    ),
  });

  const onHeaderPress = useCallback(
    (icon: string) => {
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
    },
    [headerIcons, navigation, weatherStore]
  );

  const goToPageWithoutAnimation = useCallback((pageNumber: number) => {
    if (pagerRef.current) {
      requestAnimationFrame(() => {
        pagerRef.current?.setPageWithoutAnimation(pageNumber);
      });
    }
  }, []);

  const scrollListView = useCallback(
    (pageIndex: number, offset: number, isAnimated: boolean) => {
      scrollViewRefs.current?.[pageIndex]?.scrollTo({
        y: offset,
        animated: isAnimated,
      });
    },
    []
  );

  const onLeftNavigationPress = useCallback(() => {
    const newIndex =
      weatherStore.selectedIndex === 0
        ? weatherStore.places.length - 1
        : weatherStore.selectedIndex - 1;
    if (offsetY.value >= INPUT_MAX_VALUE) {
      scrollListView(newIndex, INPUT_MAX_VALUE, false);
    }
    goToPageWithoutAnimation(newIndex);
  }, [
    goToPageWithoutAnimation,
    offsetY.value,
    scrollListView,
    weatherStore.places.length,
    weatherStore.selectedIndex,
  ]);

  const onRightNavigationPress = useCallback(() => {
    const newIndex =
      weatherStore.selectedIndex === weatherStore.places.length - 1
        ? 0
        : weatherStore.selectedIndex + 1;
    if (offsetY.value >= INPUT_MAX_VALUE) {
      scrollListView(newIndex, INPUT_MAX_VALUE, false);
    }
    goToPageWithoutAnimation(newIndex);
  }, [
    goToPageWithoutAnimation,
    offsetY.value,
    scrollListView,
    weatherStore.places.length,
    weatherStore.selectedIndex,
  ]);

  const scrollViewRefs = useRef<(ScrollView | null)[]>([]);

  const onPageSelected = (e: PagerViewOnPageSelectedEvent) => {
    const position = e.nativeEvent.position;
    weatherStore.setSelectedIndex(position);
  };

  const handleSwipe = (tranlationX: number) => {
    if (tranlationX < -50) {
      onLeftNavigationPress();
    } else {
      onRightNavigationPress();
    }
  };

  const handleMomentumEnd = (offset: number) => {
    if (offset > INPUT_MAX_VALUE) return;
    if (offset < INPUT_MAX_VALUE / 2) {
      scrollListView(weatherStore.selectedIndex, 0, true);
    } else if (offset > INPUT_MAX_VALUE / 2) {
      scrollListView(weatherStore.selectedIndex, INPUT_MAX_VALUE, true);
    }
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      const offset = e.contentOffset.y;
      offsetY.value = offset;
    },
    onMomentumEnd: (e) => {
      const offset = e.contentOffset.y;
      runOnJS(handleMomentumEnd)(offset);
    },
  });

  return (
    <ThemedView flex enableInsetsTop>
      <ThemedView>
        <HeaderIcons headerIcons={headerIcons} onHeaderPress={onHeaderPress} />
        <PlaceNavigation
          progress={offsetY}
          onLeftPress={onLeftNavigationPress}
          onRightPress={onRightNavigationPress}
        />
      </ThemedView>

      <PagerView
        ref={pagerRef}
        scrollEnabled={false}
        style={styles.container}
        initialPage={weatherStore.selectedIndex}
        onPageSelected={onPageSelected}
      >
        {allWeather.map((weather, index) => {
          return (
            <ThemedView
              style={styles.page}
              key={`page ${weatherStore.places[index].place_id}`}
            >
              {weather.data && (
                <Animated.ScrollView
                  ref={(el) => {
                    scrollViewRefs.current[index] = el as ScrollView | null;
                  }}
                  onScroll={onScroll}
                >
                  <ThemedView paddingBottom={18}>
                    <CurrentWeatherInfo
                      onSwipe={handleSwipe}
                      currentWeather={weather.data.current}
                    />
                  </ThemedView>
                  <ThemedView>
                    <ListHourly
                      hourly={weather.data.forecast.hourly.data}
                      timezone={weatherStore.places[index].timezone}
                    />
                    <ThemedView paddingTop={12}>
                      <ListDaily daily={weather.data.forecast.daily.data} />
                    </ThemedView>
                    <ThemedView paddingHorizontal={12}>
                      <Life
                        current={weather.data.current}
                        astronomy={weather.data.astronomy}
                      />
                    </ThemedView>
                  </ThemedView>
                </Animated.ScrollView>
              )}
            </ThemedView>
          );
        })}
      </PagerView>
    </ThemedView>
  );
});

export default HomeScreen;
const styles = StyleSheet.create({
  lifeRow: { flexDirection: "row", flexWrap: "wrap" },
  container: {
    flex: 1,
  },
  page: {},
  lifeItem: {
    flex: 1,
    borderWidth: 0.3,
    height: Size.screenWidth * 0.2,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "red",
  },
});
