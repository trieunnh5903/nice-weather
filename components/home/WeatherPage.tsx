import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { observer } from "mobx-react-lite";
import ThemedView from "../common/Themed/ThemedView";
import { Forecast } from "@/types/weather/forecast";
import { AstronomyResponse } from "@/types/weather/astronomy";
import { CurrentWeatherResponse } from "@/types/weather/currenWeather";
import { UseQueryResult } from "@tanstack/react-query";
import { CurrentWeatherSection } from ".";
import ForecastSection from "./ForecastSection";
import LifeSection from "./LifeSection";
import { useStores } from "@/hooks/common";
// const CurrentWeatherSection = React.lazy(
//   () => import("./home/CurrentWeatherSection")
// );

// const ForecastSection = React.lazy(() => import("./home/ForecastSection"));
// const LifeSection = React.lazy(() => import("./home/LifeSection"));

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
    index,
    scrollViewRefs,
    onScroll,
    handleSwipe,
    current,
    forecast,
    astronomy,
  }) => {
    const { weatherStore } = useStores();

    return (
      <ThemedView>
        <Animated.ScrollView
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          ref={(el) => {
            scrollViewRefs.current[index] = el as ScrollView | null;
          }}
          onScroll={onScroll}
        >
          {current.isSuccess && (
            <CurrentWeatherSection
              onSwipe={handleSwipe}
              temperatureUnit={weatherStore.temperatureUnit}
              currentWeather={current.data.current}
              dataUpdatedAt={current.dataUpdatedAt}
            />
          )}

          <ForecastSection
            hourly={forecast.data?.hourly.data}
            daily={forecast.data?.daily.data}
            isSuccess={forecast.isSuccess}
            temperatureUnit={weatherStore.temperatureUnit}
          />

          {current.isSuccess && astronomy.isSuccess && (
            <LifeSection
              current={current.data.current}
              astronomy={astronomy.data.results}
            />
          )}
        </Animated.ScrollView>
      </ThemedView>
    );
  }
);

export default WeatherPage;
