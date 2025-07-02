import { useCallback } from "react";
import { useNavigation, useRouter } from "expo-router";
import { Alert } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { useStores } from "../common";

export const useHeaderActions = () => {
  const { weatherStore } = useStores();
  const navigation = useNavigation();
  const router = useRouter();

  const deletePlace = useCallback(() => {
    Alert.alert("", "Delete this location?", [
      { text: "No" },
      {
        text: "Yes",
        onPress: () => {
          if (weatherStore.places.length === 1) {
            navigation.dispatch(
              CommonActions.reset({ routes: [{ name: "index", key: "index" }] })
            );
          }
          weatherStore.deletePlace(weatherStore.selectedPlace.place_id);
        },
      },
    ]);
  }, [navigation, weatherStore]);

  const onHeaderPress = useCallback(
    (icon: string) => {
      switch (icon) {
        case "menu":
          router.navigate("/all-locations");
          break;
        case "add":
          router.navigate("/search");
          break;
        case "delete-outline":
          deletePlace();
          break;
      }
    },
    [deletePlace]
  );

  return { onHeaderPress };
};
