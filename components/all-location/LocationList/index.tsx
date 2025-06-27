import React, { useCallback } from "react";
import { FlatList } from "react-native-gesture-handler";
import { Divider } from "react-native-paper";
import { SharedValue } from "react-native-reanimated";
import { goBack } from "@/utils/navigationUtils";
import { useLocationList } from "@/hooks/location";
import { WeatherItem } from "./WeatherItem";

interface LocationListProps {
  multipleDelete: boolean;
  selectedItems: string[];
  handleSelectItem: (id: string) => void;
  progress: SharedValue<number>;
}

const LocationList = ({
  multipleDelete,
  selectedItems,
  handleSelectItem,
  progress,
}: LocationListProps) => {
  const { getTemperature, places, setSelectedIndex } = useLocationList();

  const onLocationPress = useCallback(
    (index: number, id: string) => {
      if (multipleDelete) {
        handleSelectItem(id);
      } else {
        setSelectedIndex(index);
        goBack();
      }
    },
    [handleSelectItem, multipleDelete]
  );

  return (
    <FlatList
      data={places}
      keyExtractor={(item) => item.place_id}
      ItemSeparatorComponent={() => <Divider />}
      renderItem={({ item, index }) => {
        return (
          <WeatherItem
            temperature={getTemperature(index)}
            progress={progress}
            onLocationPress={onLocationPress}
            place={item}
            index={index}
            selectedItems={selectedItems}
          />
        );
      }}
    />
  );
};

export default LocationList;
