import { placeUtils } from "@/utils";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import ThemedView from "../common/Themed/ThemedView";
import ThemedText from "../common/Themed/ThemedText";
import { Divider } from "react-native-paper";
import { Place } from "@/types/weather/place";
import { memo } from "react";
import { useAppTheme } from "@/hooks/common";

interface PlaceItemProps {
  item: Place;
  onPress: (item: PlaceItemProps["item"]) => void;
  loading?: boolean;
}
export const PlaceItem: React.FC<PlaceItemProps> = memo(
  ({ item, onPress, loading }) => {
    const themeColor = useAppTheme();
    const address = placeUtils.getAddress(item);
    return (
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => onPress(item)}
        key={item.place_id}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 12,
          gap: 6,
        }}
      >
        <ThemedView flex>
          <ThemedText>{item.name}</ThemedText>
          <ThemedText type="label">{address}</ThemedText>
        </ThemedView>
        {loading && <ActivityIndicator testID="ActivityIndicator" color={themeColor.primary} size={24} />}
        <Divider />
      </TouchableOpacity>
    );
  }
);

PlaceItem.displayName = "PlaceItem";
