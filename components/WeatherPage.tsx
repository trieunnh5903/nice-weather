import React from "react";
import ThemedView from "./ThemedView";
import Animated from "react-native-reanimated";
import { CurrentWeatherInfo, Life, ListDaily, ListHourly } from "./home";
import { ScrollView } from "react-native-gesture-handler";
import { AstronomyResponse, CurrentWeatherResponse, Forecast } from "@/type";
import { UseQueryResult } from "@tanstack/react-query";
import { useStores } from "@/hooks";
import { observer } from "mobx-react-lite";

interface WeatherPageProps {
  index: number;
  scrollViewRefs: React.MutableRefObject<(ScrollView | null)[]>;
  onScroll: any;
  handleSwipe: (velocityX: number) => void;
  current: UseQueryResult<CurrentWeatherResponse, Error>;
  forecast: UseQueryResult<Forecast, Error>;
  astronomy: UseQueryResult<AstronomyResponse, Error>;
}

const WeatherPage: React.FC<WeatherPageProps> = observer(
  ({
    astronomy,
    current,
    forecast,
    handleSwipe,
    index,
    onScroll,
    scrollViewRefs,
  }) => {
    const { weatherStore } = useStores();
    return (
      <ThemedView>
        <Animated.ScrollView
          overScrollMode={"never"}
          showsVerticalScrollIndicator={false}
          ref={(el) => {
            scrollViewRefs.current[index] = el as ScrollView | null;
          }}
          onScroll={onScroll}
        >
          {current.isSuccess && (
            <ThemedView paddingBottom={18}>
              <CurrentWeatherInfo
                temperatureUnit={weatherStore.temperatureUnit}
                onSwipe={handleSwipe}
                currentWeather={current.data.current}
                updatedAt={current.dataUpdatedAt}
              />
            </ThemedView>
          )}

          {forecast.isSuccess && (
            <ThemedView>
              <ListHourly
                hourly={forecast.data.hourly.data}
                temperatureUnit={weatherStore.temperatureUnit}
              />
              <ThemedView paddingTop={12}>
                <ListDaily
                  daily={forecast.data.daily.data}
                  temperatureUnit={weatherStore.temperatureUnit}
                />
              </ThemedView>
            </ThemedView>
          )}

          {astronomy.isSuccess && current.isSuccess && (
            <ThemedView paddingTop={12} paddingHorizontal={12}>
              <Life
                current={current.data.current}
                astronomy={astronomy.data.results}
              />
            </ThemedView>
          )}
        </Animated.ScrollView>
      </ThemedView>
    );
  }
);

export default WeatherPage;
