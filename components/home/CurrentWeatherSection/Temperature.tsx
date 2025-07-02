import ThemedText from "@/components/common/Themed/ThemedText";
import { TemperatureUnit } from "@/types/common/unit";
import { getTemperatureText } from "@/utils/weatherUtils";
import { StyleSheet } from "react-native";

export const Temperature: React.FC<{
  temp_c: number;
  temp_f: number;
  temperatureUnit: TemperatureUnit;
}> = ({ temp_c, temp_f, temperatureUnit }) => {
  const temperature = getTemperatureText(temp_c, temp_f, temperatureUnit);
  return <ThemedText style={styles.celsius}>{temperature}</ThemedText>;
};

const styles = StyleSheet.create({
  celsius: {
    fontSize: 70,
  },
});
