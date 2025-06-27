import { ThemedView } from "@/components";
import { HeaderIcons, PlaceNavigation, WeatherPager } from "@/components/home";
import {
  useLanguage,
  usePagerNavigation,
  useScrollBehavior,
  useStores,
  useFullWeatherData,
  useHeaderActions,
} from "@/hooks";
import { ActivityIndicator, StyleSheet } from "react-native";
import { observer } from "mobx-react-lite";
import { Size } from "@/constants/size";
import { useFocusEffect } from "expo-router";
import { AppColors } from "@/constants/colors";
import { MaterialIconName } from "@/types/common/materialIcon";

const INPUT_MAX_VALUE = 160;

const HomeScreen: React.FC = observer(() => {
  const { weatherStore } = useStores();
  const { currentLanguage } = useLanguage();
  const headerIcons: MaterialIconName[] = ["menu", "add", "delete-outline"];
  const { onHeaderPress } = useHeaderActions();
  const { onScroll, scrollListView, offsetY, scrollViewRefs } =
    useScrollBehavior(INPUT_MAX_VALUE, weatherStore.selectedIndex);

  const {
    onPageSelected,
    handleNavigation,
    handleSwipe,
    goToPageWithoutAnimation,
    pagerRef,
    pageIndex,
  } = usePagerNavigation({
    selectedIndex: weatherStore.selectedIndex,
    totalPages: weatherStore.places.length,
    setSelectedIndex: weatherStore.setSelectedIndex,
    INPUT_MAX_VALUE,
    offsetY,
    scrollListView,
  });

  const {
    astronomyQueries,
    currentWeatherQueries,
    forecastQueries,
    isSuccess,
  } = useFullWeatherData(weatherStore.places, currentLanguage);

  useFocusEffect(() => {
    if (pageIndex !== weatherStore.selectedIndex && isSuccess) {
      goToPageWithoutAnimation(weatherStore.selectedIndex);
    }
  });

  if (!isSuccess) {
    return (
      <ThemedView flex style={styles.centered}>
        <ActivityIndicator color={AppColors.dark.primary} />
      </ThemedView>
    );
  }

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

      <WeatherPager
        places={weatherStore.places}
        scrollViewRefs={scrollViewRefs}
        onScroll={onScroll}
        handleSwipe={handleSwipe}
        currentWeather={currentWeatherQueries}
        forecast={forecastQueries}
        astronomy={astronomyQueries}
        pagerRef={pagerRef}
        initialIndex={weatherStore.selectedIndex}
        onPageSelected={onPageSelected}
      />
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
