import { ThemedView } from "@/components";
import {
  CurrentWeatherInfo,
  HeaderIcons,
  ListDaily,
  ListHourly,
  PlaceNavigation,
  Sunrise,
} from "@/components/home";
import { useStores } from "@/hooks";
import { MaterialIconName } from "@/type";
import { CommonActions } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { router, useNavigation } from "expo-router";
import { useCallback, useMemo } from "react";
import { Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const HomeScreen: React.FC = () => {
  console.log("home");
  const queryClient = useQueryClient();
  const headerIcons: MaterialIconName[] = useMemo(
    () => ["menu", "add", "delete-outline"],
    []
  );
  const { weatherStore } = useStores();
  const navigation = useNavigation();
  const onHeaderPress = useCallback(
    (icon: string) => {
      switch (icon) {
        case headerIcons[0]:
          router.navigate("/all-locations");
          break;
        case headerIcons[1]:
          router.navigate("/search");
          break;
        case headerIcons[2]:
          Alert.alert("", "Delete this location?", [
            { text: "No" },
            {
              text: "Yes",
              onPress: () => {
                if (weatherStore.places.length === 1) {
                  navigation.dispatch(
                    CommonActions.reset({
                      routes: [{ name: "index", key: "index" }],
                    })
                  );
                }
                weatherStore.deletePlace(weatherStore.selectedPlace.place_id);
              },
            },
          ]);
          break;
        default:
          break;
      }
    },
    [headerIcons, navigation, weatherStore]
  );

  const onMenuAction = useCallback(
    (event: string) => {
      if (event === "update") {
        queryClient.invalidateQueries();
      } else if (event === "setting") {
        router.navigate("/setting");
      }
    },
    [queryClient]
  );

  return (
    <ThemedView flex enableInsetsTop>
      <ThemedView>
        <HeaderIcons
          headerIcons={headerIcons}
          onHeaderPress={onHeaderPress}
          onMenuAction={onMenuAction}
        />
        <PlaceNavigation />
      </ThemedView>
      <ScrollView>
        <ThemedView>
          <ThemedView paddingBottom={18}>
            <CurrentWeatherInfo />
          </ThemedView>
          <ThemedView>
            <ListHourly />
            <ThemedView paddingTop={12}>
              <ListDaily />
            </ThemedView>
            <ThemedView paddingTop={12}>
              <Sunrise />
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
};

export default HomeScreen;
