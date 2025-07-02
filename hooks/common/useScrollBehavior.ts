import { getSnappedOffset } from "@/utils";
import { useCallback, useRef } from "react";
import { ScrollView } from "react-native-gesture-handler";
import {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

export const useScrollBehavior = (
  inputMaxValue: number,
  selectedIndex: number
) => {
  const offsetY = useSharedValue(0);
  const scrollViewRefs = useRef<(ScrollView | null)[]>([]);

  const scrollListView = useCallback(
    (pageIndex: number, offset: number, isAnimated: boolean) => {
      scrollViewRefs?.current?.[pageIndex]?.scrollTo({
        y: offset,
        animated: isAnimated,
      });
    },
    []
  );

  const handleMomentumEnd = useCallback(
    (offset: number) => {
      const snapped = getSnappedOffset(offset, inputMaxValue);
      if (snapped !== null) {
        runOnJS(scrollListView)(selectedIndex, snapped, true);
      }
    },
    [inputMaxValue, scrollListView, selectedIndex]
  );

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      offsetY.value = e.contentOffset.y;
    },
    onMomentumEnd: (e) => {
      runOnJS(handleMomentumEnd)(e.contentOffset.y);
    },
  });

  return { offsetY, scrollViewRefs, scrollListView, onScroll };
};
