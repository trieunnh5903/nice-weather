import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useStores } from "../common";

export function useLocationManagement() {
  const { weatherStore } = useStores();
  const navigation = useNavigation();
  const [multipleDelete, setMultipleDelete] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const enableMultipleDelete = () => setMultipleDelete(true);
  const disableMultipleDelete = () => setMultipleDelete(false);

  const selectLocation = useCallback((id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const selectAll = useCallback(() => {
    if (selectedItems.length === weatherStore.places.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(weatherStore.places.map((p) => p.place_id));
    }
  }, [selectedItems.length, weatherStore.places]);

  const resetNavigation = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        routes: [{ name: "index", key: "index" }],
      })
    );
  }, [navigation]);

  const deleteSelected = useCallback(() => {
    weatherStore.deleteMany(selectedItems);
    setSelectedItems([]);
    disableMultipleDelete();
  }, [selectedItems, weatherStore]);

  const deleteAll = useCallback(() => {
    resetNavigation();
    weatherStore.deleteAll();
  }, [resetNavigation, weatherStore]);

  const confirmDelete = useCallback(() => {
    if (selectedItems.length === 0) return;
    Alert.alert("", "Delete this location?", [
      { text: "Cancel" },
      {
        text: "OK",
        onPress: () => {
          if (selectedItems.length === weatherStore.places.length) {
            deleteAll();
          } else {
            deleteSelected();
          }
        },
      },
    ]);
  }, [
    deleteAll,
    deleteSelected,
    selectedItems.length,
    weatherStore.places.length,
  ]);

  return {
    multipleDelete,
    selectedItems,
    enableMultipleDelete,
    disableMultipleDelete,
    selectLocation,
    selectAll,
    confirmDelete,
  };
}
