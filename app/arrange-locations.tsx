import { ThemedText, ThemedView } from "@/components";
import { useAppTheme, useStores } from "@/hooks";
import { Place } from "@/types/weather/place";
import { placeUtils } from "@/utils";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Pressable, View } from "react-native";
import DraggableFlatList, { RenderItem } from "react-native-draggable-flatlist";
import { Divider } from "react-native-paper";

const DraggableList = observer(() => {
  const { weatherStore } = useStores();
  const appTheme = useAppTheme();
  const { t } = useTranslation();
  const renderItem: RenderItem<Place> = ({ item, drag, isActive }) => {
    return (
      <ThemedView
        style={[
          styles.item,
          {
            backgroundColor: isActive ? appTheme.primary : appTheme.background,
          },
        ]}
      >
        <View style={styles.place}>
          <ThemedText type="subtitle" numberOfLines={1}>
            {item.name}
          </ThemedText>
          <ThemedText numberOfLines={1}>
            {placeUtils.getAddress(item)}
          </ThemedText>
        </View>
        <Pressable onLongPress={drag}>
          <View style={styles.icon}>
            <MaterialIcons name="menu" size={24} color={appTheme.icon} />
          </View>
        </Pressable>
      </ThemedView>
    );
  };

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
        data={toJS(weatherStore.places)}
        renderItem={renderItem}
        keyExtractor={(item) => item.place_id}
        onDragEnd={({ data }) => weatherStore.setPlaces(data)}
      />
    </ThemedView>
  );
});

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
  text: {
    fontSize: 18,
  },
  row: {
    flexDirection: "row",
  },
});

export default DraggableList;
