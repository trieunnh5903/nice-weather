import { getNextIndex, getPreviousIndex } from "@/utils";
import { useCallback, useRef, useState } from "react";
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from "react-native-pager-view";
import { SharedValue } from "react-native-reanimated";

interface UsePagerNavigationProps {
  selectedIndex: number;
  totalPages: number;
  setSelectedIndex: (index: number) => void;
  scrollListView: (
    pageIndex: number,
    offset: number,
    isAnimated: boolean
  ) => void;
  INPUT_MAX_VALUE: number;
  offsetY: SharedValue<number>;
}

export const usePagerNavigation = ({
  selectedIndex,
  setSelectedIndex,
  totalPages,
  scrollListView,
  INPUT_MAX_VALUE,
  offsetY,
}: UsePagerNavigationProps) => {
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
        ? getNextIndex(selectedIndex, totalPages)
        : getPreviousIndex(selectedIndex, totalPages);

      navigateToIndex(newIndex);
    },
    [navigateToIndex, selectedIndex, totalPages]
  );

  const onPageSelected = useCallback((e: PagerViewOnPageSelectedEvent) => {
    const newIndex = e.nativeEvent.position;
    setSelectedIndex(newIndex);
    setPageIndex(newIndex);
  }, [setSelectedIndex]);

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
