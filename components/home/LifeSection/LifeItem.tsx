import { useAppTheme } from "@/hooks";
import { StyleSheet } from "react-native";
import { Size } from "@/constants/size";
import ThemedView from "@/components/common/Themed/ThemedView";
import { Title } from "@/components/common/Themed/Title";
import { Subtitle } from "@/components/common/Themed/Subtitle";

interface LifeItemProps {
  title: string;
  values: React.ReactNode[];
  borderLeft?: boolean;
  borderRight?: boolean;
}

export const LifeItem: React.FC<LifeItemProps> = ({
  title,
  values,
  borderLeft = true,
  borderRight = true,
}) => {
  const theme = useAppTheme();
  return (
    <ThemedView
      style={[
        styles.centered,
        styles.lifeItem,
        {
          borderColor: theme.border,
          borderLeftWidth: borderLeft ? 0.5 : 0,
          borderRightWidth: borderRight ? 0.5 : 0,
        },
      ]}
    >
      <Title>{title}</Title>
      {values.map((v, i) => (
        <Subtitle key={i}>{v}</Subtitle>
      ))}
    </ThemedView>
  );
};
const styles = StyleSheet.create({
  lifeRow: { flexDirection: "row", flexWrap: "wrap" },

  lifeItem: {
    flex: 1,
    borderWidth: 0.5,
    height: Size.screenWidth * 0.2,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
});
