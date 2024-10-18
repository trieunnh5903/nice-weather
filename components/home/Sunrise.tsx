import { StyleSheet } from "react-native";
import React, { useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { useAppTheme, useSunriseSelected } from "@/hooks";
import { weatherUtils } from "@/utils";
import ThemedView from "../ThemedView";
import ThemedText from "../ThemedText";
import { Feather } from "@expo/vector-icons";
import { Size } from "@/constants/Size";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path, Text } from "react-native-svg";
const AnimatedPath = Animated.createAnimatedComponent(Path);

const Sunrise = observer(() => {
  const themeColor = useAppTheme();
  const data = useSunriseSelected();
  const iconColor = themeColor.icon;

  const currentTimeInPercent = useMemo(() => {
    if (!data) return null;
    const today = data[0];
    const now = new Date().toLocaleString("en-US", {
      timeZone: today.timezone,
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      (weatherUtils.convertToMinute(now) -
        weatherUtils.convertToMinute(today.sunrise)) /
      (weatherUtils.convertToMinute(today.sunset) -
        weatherUtils.convertToMinute(today.sunrise))
    );
  }, [data]);
  if (!data) return null;
  const tomorrow = data[1];

  return (
    <ThemedView>
      <ThemedView paddingHorizontal={12}>
        <ThemedText uppercase type="subtitle">
          life
        </ThemedText>
      </ThemedView>
      <ThemedView style={[styles.row, { justifyContent: "space-evenly" }]}>
        {currentTimeInPercent && (
          <ThemedView style={[styles.centered]}>
            <SunriseChart currentTimeInPercent={currentTimeInPercent} />
          </ThemedView>
        )}
        <ThemedView
          style={[
            styles.centered,
            styles.gap_6,
            styles.tomorrow,
            { borderColor: iconColor },
          ]}
        >
          <ThemedText>Tomorrow</ThemedText>
          <ThemedView style={[styles.row, styles.centered, styles.gap_6]}>
            <Feather name="sunrise" size={24} color={iconColor} />
            <ThemedText>
              {weatherUtils.formatSunrise(tomorrow.sunrise)}
            </ThemedText>
          </ThemedView>
          <ThemedView style={[styles.row, styles.centered, styles.gap_6]}>
            <Feather name="sunset" size={24} color={iconColor} />
            <ThemedText>
              {weatherUtils.formatSunrise(tomorrow.sunset)}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
});

const SunriseChart = ({
  currentTimeInPercent,
}: {
  currentTimeInPercent: number;
}) => {
  const width = (Size.screenWidth - 12 * 2) / 2;
  const height = width / 2;
  const radius = width / 4;
  const centerY = width / 2 - 30;
  const startX = width / 4;
  const endX = (width / 4) * 3;
  const p = radius * Math.PI;
  const strokeDashoffset = useSharedValue(p);
  const themeColor = useAppTheme();
  const bacgroundColor = themeColor.placeholder;
  const textColor = themeColor.text;
  useEffect(() => {
    if (currentTimeInPercent < 1) {
      strokeDashoffset.value = withTiming(p * (1 - currentTimeInPercent), {
        duration: 1000,
      });
    } else {
      strokeDashoffset.value = withTiming(p, {
        duration: 1000,
      });
    }
  }, [currentTimeInPercent, p, strokeDashoffset]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: strokeDashoffset.value,
  }));

  const data = useSunriseSelected();

  if (!data) {
    return null;
  }

  return (
    <Svg height={height} width={width}>
      <Path
        d={`M ${startX} ${centerY} A ${radius} ${radius} 0 0 1 ${endX} ${centerY}`}
        fill="transparent"
        stroke={bacgroundColor}
        strokeWidth="4"
      />
      <AnimatedPath
        d={`M ${startX} ${centerY} A ${radius} ${radius} 0 0 1 ${endX} ${centerY}`}
        fill="transparent"
        stroke={"#FFDE21"}
        strokeWidth="4"
        strokeDasharray={p}
        animatedProps={animatedProps}
      />
      <Text x={startX - 20} y={centerY + 20} fontSize="14" fill={textColor}>
        {weatherUtils.formatSunrise(data[0].sunrise)}
      </Text>
      <Text x={endX - 20} y={centerY + 20} fontSize="14" fill={textColor}>
        {weatherUtils.formatSunrise(data[0].sunset)}
      </Text>
    </Svg>
  );
};

export default Sunrise;

const styles = StyleSheet.create({
  tomorrow: {
    padding: 6,
    borderLeftWidth: 0.5,
    paddingHorizontal: 16,
  },
  row: { flexDirection: "row" },
  gap_6: {
    gap: 6,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
});
