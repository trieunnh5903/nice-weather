import { getNextIndex, getPreviousIndex } from "@/utils";
import { useCallback, useRef, useState } from "react";
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from "react-native-pager-view";
import { SharedValue } from "react-native-reanimated";
import { useStores } from "../common";

interface UsePagerNavigationProps {
  scrollListView: (
    pageIndex: number,
    offset: number,
    isAnimated: boolean
  ) => void;
  INPUT_MAX_VALUE: number;
  offsetY: SharedValue<number>;
}

export const usePagerNavigation = ({
  scrollListView,
  INPUT_MAX_VALUE,
  offsetY,
}: UsePagerNavigationProps) => {
  const { weatherStore } = useStores();
  const totalPages = weatherStore.places.length;
  const pagerRef = useRef<PagerView>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const goToPageWithoutAnimation = useCallback((pageNumber: number) => {
    pagerRef.current?.setPageWithoutAnimation(pageNumber);
  }, []);

  const navigateToIndex = useCallback(
    (newIndex: number) => {
      const shouldScrollToTop = offsetY.value < INPUT_MAX_VALUE;
      scrollListView(newIndex, shouldScrollToTop ? 0 : INPUT_MAX_VALUE, false);
      goToPageWithoutAnimation(newIndex);
    },
    [scrollListView, goToPageWithoutAnimation, offsetY.value, INPUT_MAX_VALUE]
  );

  const handleNavigation = useCallback(
    (isNext: boolean) => {
      const newIndex = isNext
        ? getNextIndex(weatherStore.selectedIndex, totalPages)
        : getPreviousIndex(weatherStore.selectedIndex, totalPages);
      // console.log(newIndex);

      navigateToIndex(newIndex);
    },
    [navigateToIndex, totalPages, weatherStore.selectedIndex]
  );

  const onPageSelected = useCallback((e: PagerViewOnPageSelectedEvent) => {
    const newIndex = e.nativeEvent.position;
    // console.log("onPageSelected", newIndex);
    weatherStore.setSelectedIndex(newIndex);
    setPageIndex(newIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSwipe = useCallback(
    (velocityX: number) => {
      handleNavigation(velocityX < -500);
    },
    [handleNavigation]
  );

  return {
    pagerRef,
    handleNavigation,
    onPageSelected,
    handleSwipe,
    goToPageWithoutAnimation,
    pageIndex,
  };
};
