import WeatherStore from "@/stores/weatherStore";
import { useCallback, useRef } from "react";
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from "react-native-pager-view";
import { SharedValue } from "react-native-reanimated";

interface UsePagerNavigationProps {
  weatherStore: WeatherStore;
  scrollListView: (
    pageIndex: number,
    offset: number,
    isAnimated: boolean
  ) => void;
  INPUT_MAX_VALUE: number;
  offsetY: SharedValue<number>;
}

export const usePagerNavigation = ({
  weatherStore,
  scrollListView,
  INPUT_MAX_VALUE,
  offsetY,
}: UsePagerNavigationProps) => {
  const pagerRef = useRef<PagerView>(null);

  const goToPageWithoutAnimation = useCallback((pageNumber: number) => {
    pagerRef.current?.setPageWithoutAnimation(pageNumber);
  }, []);

  const handleNavigation = useCallback(
    (isNext: boolean) => {
      const newIndex = isNext
        ? weatherStore.selectedIndex === weatherStore.places.length - 1
          ? 0
          : weatherStore.selectedIndex + 1
        : weatherStore.selectedIndex === 0
        ? weatherStore.places.length - 1
        : weatherStore.selectedIndex - 1;

      if (offsetY.value >= INPUT_MAX_VALUE) {
        scrollListView(newIndex, INPUT_MAX_VALUE, false);
      } else {
        scrollListView(newIndex, 0, false);
      }
      goToPageWithoutAnimation(newIndex);
    },
    [
      INPUT_MAX_VALUE,
      goToPageWithoutAnimation,
      offsetY.value,
      scrollListView,
      weatherStore.places.length,
      weatherStore.selectedIndex,
    ]
  );

  const onPageSelected = useCallback(
    (e: PagerViewOnPageSelectedEvent) => {
      weatherStore.setSelectedIndex(e.nativeEvent.position);
    },
    [weatherStore]
  );

  const handleSwipe = useCallback(
    (translationX: number) => {
      handleNavigation(translationX < -50);
    },
    [handleNavigation]
  );

  return {
    pagerRef,
    handleNavigation,
    onPageSelected,
    handleSwipe,
    goToPageWithoutAnimation,
  };
};
