import React from "react";
import PagerView from "react-native-pager-view";
import { StyleSheet } from "react-native";
import { WeatherPage } from "@/components";
import { Place } from "@/types/weather/place";

interface WeatherPagerProps {
  places: Place[];
  scrollViewRefs: any;
  onScroll: (e: any) => void;
  handleSwipe: (velocityX: number) => void;
  currentWeather: any[];
  forecast: any[];
  astronomy: any[];
  pagerRef: React.RefObject<PagerView>;
  initialIndex: number;
  onPageSelected: (e: any) => void;
}

export const WeatherPager: React.FC<WeatherPagerProps> = ({
  places,
  scrollViewRefs,
  onScroll,
  handleSwipe,
  currentWeather,
  forecast,
  astronomy,
  pagerRef,
  initialIndex,
  onPageSelected,
}) => {
  return (
    <PagerView
      ref={pagerRef}
      scrollEnabled={false}
      style={styles.container}
      initialPage={initialIndex}
      onPageSelected={onPageSelected}
    >
      {places.map((place, index) => (
        <WeatherPage
          key={`page-${place.place_id}`}
          index={index}
          scrollViewRefs={scrollViewRefs}
          onScroll={onScroll}
          handleSwipe={handleSwipe}
          current={currentWeather[index]}
          forecast={forecast[index]}
          astronomy={astronomy[index]}
        />
      ))}
    </PagerView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
