import ThemedText from "@/components/common/Themed/ThemedText";

export const WeatherCondition: React.FC<{
  conditionText: string;
}> = ({ conditionText }) => {
  return <ThemedText>{conditionText}</ThemedText>;
};
