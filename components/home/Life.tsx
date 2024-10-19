import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AstronomyDetail from "./AstronomyDetail";
import ThemedText from "../ThemedText";
import ThemedView from "../ThemedView";
import { Size } from "@/constants/Size";
import { Astronomy, CurrentWeather } from "@/type";
import { useAppTheme } from "@/hooks";

interface LifeProps {
  current: CurrentWeather;
  astronomy: Astronomy[];
}
const Life: React.FC<LifeProps> = ({ astronomy, current }) => {
  const appTheme = useAppTheme();
  return (
    <ThemedView>
      <ThemedText uppercase type="subtitle">
        life
      </ThemedText>
      <ThemedView paddingTop={6} paddingBottom={12}>
        <ThemedView style={styles.lifeRow}>
          <ThemedView
            style={[
              styles.centered,
              styles.lifeItem,
              { borderLeftWidth: 0, borderColor: appTheme.border },
            ]}
          >
            <ThemedText>Wind</ThemedText>
            <ThemedText>{current.wind_dir}</ThemedText>
            <ThemedText>{current.wind_kph} km/h</ThemedText>
          </ThemedView>
          <ThemedView
            style={[
              styles.centered,
              styles.lifeItem,
              { borderRightWidth: 0, borderColor: appTheme.border },
            ]}
          >
            <ThemedText>UV Index</ThemedText>
            <ThemedText>{current.uv}</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.lifeRow}>
          <ThemedView
            style={[
              styles.centered,
              styles.lifeItem,
              { borderLeftWidth: 0, borderColor: appTheme.border },
            ]}
          >
            <ThemedText>Air quantity</ThemedText>
            <ThemedText>{current.air_quality["us-epa-index"]}</ThemedText>
          </ThemedView>
          <ThemedView
            style={[
              styles.centered,
              styles.lifeItem,
              { borderRightWidth: 0, borderColor: appTheme.border },
            ]}
          >
            <ThemedText>Humidity</ThemedText>
            <ThemedText>{current.humidity}%</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
      <AstronomyDetail astronomy={astronomy} />
    </ThemedView>
  );
};

export default Life;

const styles = StyleSheet.create({
  lifeRow: { flexDirection: "row", flexWrap: "wrap" },

  lifeItem: {
    flex: 1,
    borderWidth: 0.3,
    height: Size.screenWidth * 0.2,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
});
