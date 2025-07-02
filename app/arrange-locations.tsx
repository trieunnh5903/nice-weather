import { DraggableItem } from "@/components/arrange-locations";
import { ThemedView } from "@/components/common/Themed";
import { useAppTheme, useStores } from "@/hooks/common";
import { Place } from "@/types/weather/place";
import { Stack } from "expo-router";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import DraggableFlatList, { RenderItem } from "react-native-draggable-flatlist";
import { Divider } from "react-native-paper";

const DraggableList = observer(() => {
  const { weatherStore } = useStores();
  const appTheme = useAppTheme();
  const { t } = useTranslation();
  const renderItem: RenderItem<Place> = ({ item, drag, isActive }) => (
    <DraggableItem
      item={item}
      drag={drag}
      isActive={isActive}
      appTheme={appTheme}
    />
  );
  const places = useMemo(
    () => toJS(weatherStore.places),
    [weatherStore.places]
  );
  if (weatherStore.places.length === 0) return null;
  return (
    <ThemedView>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t("arrange_locations.screen_title"),
        }}
      />
      <DraggableFlatList
        ItemSeparatorComponent={() => <Divider />}
        data={places}
        renderItem={renderItem}
        keyExtractor={(item) => item.place_id}
        onDragEnd={({ data }) => weatherStore.setPlaces(data)}
      />
    </ThemedView>
  );
});

export default DraggableList;
