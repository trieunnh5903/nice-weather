import React, { useEffect } from "react";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path, Text } from "react-native-svg";
import { Size } from "@/constants/size";
import { Astronomy } from "@/types/weather/astronomy";
import { weatherUtils } from "@/utils";
import { useAppTheme } from "@/hooks/common";

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface SunriseChartProps {
  currentTimeInPercent: number;
  astronomy: Astronomy;
}

const SunriseChart: React.FC<SunriseChartProps> = ({
  currentTimeInPercent,
  astronomy,
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
  const backgroundColor = themeColor.placeholder;
  const textColor = themeColor.text;

  useEffect(() => {
    const clamped = Math.max(0, Math.min(1, currentTimeInPercent));
    strokeDashoffset.value = withTiming(p * (1 - clamped), { duration: 1000 });
  }, [currentTimeInPercent]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: strokeDashoffset.value,
  }));

  return (
    <Svg height={height} width={width}>
      <Path
        d={`M ${startX} ${centerY} A ${radius} ${radius} 0 0 1 ${endX} ${centerY}`}
        fill="transparent"
        stroke={backgroundColor}
        strokeWidth="4"
      />
      <AnimatedPath
        d={`M ${startX} ${centerY} A ${radius} ${radius} 0 0 1 ${endX} ${centerY}`}
        fill="transparent"
        stroke="#FFDE21"
        strokeWidth="4"
        strokeDasharray={p}
        animatedProps={animatedProps}
      />
      <Text x={startX - 20} y={centerY + 20} fontSize="13" fill={textColor}>
        {weatherUtils.formatSunrise(astronomy.sunrise)}
      </Text>
      <Text x={endX - 20} y={centerY + 20} fontSize="13" fill={textColor}>
        {weatherUtils.formatSunrise(astronomy.sunset)}
      </Text>
    </Svg>
  );
};

export default SunriseChart;
