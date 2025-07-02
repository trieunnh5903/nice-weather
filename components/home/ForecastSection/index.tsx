import { TemperatureUnit } from "@/types/common/unit";
import { Daily, Hourly } from "@/types/weather/forecast";
import { memo } from "react";
import ThemedView from "../../common/Themed/ThemedView";
import ListHourly from "./ListHourly";
import ListDaily from "./ListDaily";

interface ForecastSectionProps {
  hourly?: Hourly[];
  daily?: Daily[];
  temperatureUnit: TemperatureUnit;
  isSuccess: boolean;
}

const ForecastSection: React.FC<ForecastSectionProps> = memo(
  ({ isSuccess, daily, hourly, temperatureUnit }) => {
    if (!isSuccess || !hourly?.length || !daily?.length) return null;
    return (
      <ThemedView>
        <ListHourly hourly={hourly} temperatureUnit={temperatureUnit} />
        <ThemedView paddingTop={12}>
          <ListDaily daily={daily} temperatureUnit={temperatureUnit} />
        </ThemedView>
      </ThemedView>
    );
  }
);
ForecastSection.displayName = "ForecastSection";
export default ForecastSection;
