import { useAppTheme } from "@/hooks/common";
import { Place } from "@/types/weather/place";
import { ThemedText, ThemedView } from "../common/Themed";
import { Pressable, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { placeUtils } from "@/utils";

export const DraggableItem = ({
  item,
  drag,
  isActive,
  appTheme,
}: {
  item: Place;
  drag: () => void;
  isActive: boolean;
  appTheme: ReturnType<typeof useAppTheme>;
}) => {
  return (
    <ThemedView
      style={[
        styles.item,
        { backgroundColor: isActive ? appTheme.primary : appTheme.background },
      ]}
    >
      <View style={styles.place}>
        <ThemedText type="subtitle" numberOfLines={1}>
          {item.name}
        </ThemedText>
        <ThemedText numberOfLines={1}>{placeUtils.getAddress(item)}</ThemedText>
      </View>
      <Pressable onLongPress={drag}>
        <View style={styles.icon}>
          <MaterialIcons name="menu" size={24} color={appTheme.icon} />
        </View>
      </Pressable>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  icon: {
    padding: 20,
  },

  place: {
    flex: 1,
    paddingHorizontal: 12,
  },
  item: {
    paddingVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // gap: 20,
  },
});
