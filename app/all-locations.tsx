import { Alert } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { router, Stack, useNavigation } from "expo-router";
import { MaterialIconName } from "@/type";
import { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { CommonActions } from "@react-navigation/native";
import { Divider } from "react-native-paper";
import { useAppTheme, useStores } from "@/hooks";
import { ThemedView } from "@/components";
import {
  CustomHeaderLeft,
  CustomHeaderRight,
  FooterOfDeleteMode,
  LocationList,
} from "@/components/all-location";

const HEADER_ICONS: MaterialIconName[] = ["add", "delete-outline"];

const AllLocation = () => {
  const { weatherStore } = useStores();
  const themeColor = useAppTheme();
  const progress = useSharedValue(0);
  const navigation = useNavigation();
  const [multipleDelete, setMultipleDelete] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    progress.value = withTiming(multipleDelete ? 1 : 0, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
  }, [multipleDelete, progress]);

  const onHeaderPress = useCallback((icon: MaterialIconName) => {
    switch (icon) {
      case HEADER_ICONS[0]:
        router.navigate("./search");
        break;
      case HEADER_ICONS[1]:
        setMultipleDelete(true);
        break;
      default:
        break;
    }
  }, []);

  const onCancelPress = () => {
    setMultipleDelete(false);
  };

  const handleSelectItem = useCallback((id: string) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((item) => item !== id)
        : [...prevSelectedItems, id]
    );
  }, []);

  const handleSelecteAll = useCallback(() => {
    if (selectedItems.length === weatherStore.places.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(weatherStore.places.map((place) => place.place_id));
    }
  }, [selectedItems.length, weatherStore.places]);

  const resetNavigation = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        routes: [{ key: "index", name: "index" }],
      })
    );
  }, [navigation]);

  const handleDeleteSelected = useCallback(() => {
    weatherStore.deleteMany(selectedItems);
  }, [selectedItems, weatherStore]);

  const handleDeleteAll = useCallback(() => {
    resetNavigation();
    weatherStore.deleteAll();
  }, [resetNavigation, weatherStore]);

  const onDeletePress = useCallback(() => {
    if (selectedItems.length === 0) return;
    Alert.alert("", "Delete this location?", [
      { text: "Cancel" },
      {
        text: "OK",
        onPress: () => {
          if (selectedItems.length === weatherStore.places.length) {
            handleDeleteAll();
          } else {
            handleDeleteSelected();
            setSelectedItems([]);
            setMultipleDelete(false);
          }
        },
      },
    ]);
  }, [
    handleDeleteAll,
    handleDeleteSelected,
    selectedItems.length,
    weatherStore.places.length,
  ]);

  const screenOptions: React.ComponentProps<typeof Stack.Screen>["options"] = {
    headerShown: true,
    title: "",
    headerRight() {
      return (
        <CustomHeaderRight
          multipleDelete={multipleDelete}
          icons={HEADER_ICONS}
          onHeaderPress={onHeaderPress}
          numberOfSelected={selectedItems.length}
          progress={progress}
        />
      );
    },
    headerBackVisible: false,
    headerLeft: (props) => {
      return (
        <CustomHeaderLeft
          progress={progress}
          handleSelecteAll={handleSelecteAll}
          selectedItems={selectedItems}
          {...props}
        />
      );
    },
    headerTintColor: themeColor.icon,
    headerTitleAlign: "left",
    headerShadowVisible: false,
  };

  return (
    <ThemedView flex>
      <Stack.Screen options={screenOptions} />
      <Divider />
      <LocationList
        progress={progress}
        multipleDelete={multipleDelete}
        selectedItems={selectedItems}
        handleSelectItem={handleSelectItem}
      />
      <ThemedView flex />
      {multipleDelete && (
        <FooterOfDeleteMode
          onCancelPress={onCancelPress}
          onDeletePress={onDeletePress}
        />
      )}
    </ThemedView>
  );
};

export default AllLocation;
