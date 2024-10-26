import { ThemedView, WeatherPage } from "@/components";
import { HeaderIcons, PlaceNavigation } from "@/components/home";
import {
  useLanguage,
  usePagerNavigation,
  useScrollBehavior,
  useStores,
  useWeatherQueries,
} from "@/hooks";
import { MaterialIconName } from "@/type";
import { CommonActions } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";
import { useCallback, useMemo } from "react";
import { Alert, StyleSheet } from "react-native";
import PagerView from "react-native-pager-view";
import { observer } from "mobx-react-lite";
import { Size } from "@/constants/size";

const HomeScreen: React.FC = observer(() => {
  const { weatherStore } = useStores();
  const navigation = useNavigation();
  const INPUT_MAX_VALUE = 160;
  const { currentLanguage } = useLanguage();

  const headerIcons: MaterialIconName[] = useMemo(
    () => ["menu", "add", "delete-outline"],
    []
  );

  const { onScroll, scrollListView, offsetY, scrollViewRefs } =
    useScrollBehavior(INPUT_MAX_VALUE, weatherStore.selectedIndex);

  const { handleNavigation, handleSwipe, onPageSelected, pagerRef } =
    usePagerNavigation({
      INPUT_MAX_VALUE,
      offsetY,
      scrollListView,
      weatherStore,
    });

  const { allAstronomy, allCurrentWeather, allForecast, isSuccess } =
    useWeatherQueries(weatherStore.places, currentLanguage);

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

  return (
    <ThemedView flex enableInsetsTop>
      <ThemedView>
        <HeaderIcons headerIcons={headerIcons} onHeaderPress={onHeaderPress} />
        <PlaceNavigation
          progress={offsetY}
          onLeftPress={() => handleNavigation(false)}
          onRightPress={() => handleNavigation(true)}
          maxScrollAnimatedOffset={INPUT_MAX_VALUE}
        />
      </ThemedView>

      {isSuccess && (
        <PagerView
          ref={pagerRef}
          scrollEnabled={false}
          style={styles.container}
          initialPage={weatherStore.selectedIndex}
          onPageSelected={onPageSelected}
        >
          {weatherStore.places.map((place, index) => {
            return (
              <WeatherPage
                key={`page-${place.place_id}`}
                index={index}
                scrollViewRefs={scrollViewRefs}
                onScroll={onScroll}
                handleSwipe={handleSwipe}
                current={allCurrentWeather[index]}
                forecast={allForecast[index]}
                astronomy={allAstronomy[index]}
              />
            );
          })}
        </PagerView>
      )}
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
