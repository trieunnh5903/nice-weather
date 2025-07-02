import { useCallback, useEffect } from "react";
import { Stack, router } from "expo-router";
import { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { Divider } from "react-native-paper";
import {
  CustomHeaderLeft,
  CustomHeaderRight,
  FooterOfDeleteMode,
  LocationList,
} from "@/components/all-location";
import { MaterialIconName } from "@/types/common/materialIcon";
import { useAppTheme } from "@/hooks/common";
import { useLocationManagement } from "@/hooks/location";
import { ThemedView } from "@/components/common/Themed";

const HEADER_ICONS: MaterialIconName[] = ["add", "delete-outline"];

const AllLocation = () => {
  const themeColor = useAppTheme();
  const progress = useSharedValue(0);

  const {
    multipleDelete,
    selectedItems,
    enableMultipleDelete,
    disableMultipleDelete,
    selectLocation,
    selectAll,
    confirmDelete,
  } = useLocationManagement();

  useEffect(() => {
    progress.value = withTiming(multipleDelete ? 1 : 0, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
  }, [multipleDelete]);

  const onHeaderPress = useCallback((icon: MaterialIconName) => {
    switch (icon) {
      case "add":
        router.navigate("./search");
        break;
      case "delete-outline":
        enableMultipleDelete();
        break;
    }
  }, []);

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
    headerLeft: (props) => (
      <CustomHeaderLeft
        progress={progress}
        handleSelecteAll={selectAll}
        selectedItems={selectedItems}
        {...props}
      />
    ),
    headerBackVisible: false,
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
        handleSelectItem={selectLocation}
      />
      <ThemedView flex />
      {multipleDelete && (
        <FooterOfDeleteMode
          onCancelPress={disableMultipleDelete}
          onDeletePress={confirmDelete}
        />
      )}
    </ThemedView>
  );
};

export default AllLocation;
