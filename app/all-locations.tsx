import {
  Alert,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { router, Stack } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CurrentWeather, MaterialIconName } from "@/type";
import { observer } from "mobx-react-lite";
import locationUtils from "@/utils/locationUtils";
import temperatureUtils from "@/utils/temperatureUtils";
import { useWeatherTheme } from "@/hooks/useWeatherTheme";
import { ImageBackground } from "expo-image";
import RippleButtonIcon from "@/components/RippleButtonIcon";
import Animated, { FadeInLeft, FadeInRight } from "react-native-reanimated";
import { useStores } from "@/hooks/useStore";
import { FlatList } from "react-native-gesture-handler";
import { useIsFocused } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";

const AllLocation = () => {
  const { currWeatherStore } = useStores();
  const iconColor = useThemeColor({}, "tint");
  const icons: MaterialIconName[] = ["add", "delete-outline"];
  const radioButtonColor = useThemeColor({}, "tint");
  const border = useThemeColor({}, "placeholder");
  const [multipleDelete, setMultipleDelete] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const onHeaderPress = (icon: MaterialIconName) => {
    switch (icon) {
      case icons[0]:
        router.navigate("./search");
        break;
      case icons[1]:
        setMultipleDelete(!multipleDelete);
        break;
      default:
        break;
    }
  };

  const CustomHeaderRight = () => {
    return (
      <View style={styles.headerRight}>
        {icons.map((icon) => {
          return (
            <RippleButtonIcon
              onPress={() => onHeaderPress(icon)}
              key={"all-location-header" + icon}
            >
              <MaterialIcons name={icon} size={24} color={iconColor} />
            </RippleButtonIcon>
          );
        })}
        <MaterialCommunityIcons
          name="dots-vertical"
          size={24}
          color={iconColor}
        />
      </View>
    );
  };

  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSelecteAll = () => {
    if (selectedItems.length === currWeatherStore.currentWeather.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currWeatherStore.currentWeather.map((i) => i.id));
    }
  };

  const onDeletePress = () => {
    if (selectedItems.length === 0) return;

    if (selectedItems.length === currWeatherStore.currentWeather.length) {
      Alert.alert("", "Delete all this location?", [
        { text: "Cancel" },
        {
          text: "OK",
          onPress: () => {
            handleDeleteAll();
          },
        },
      ]);
    } else {
      Alert.alert("", "Delete this location?", [
        { text: "Cancel" },
        {
          text: "OK",
          onPress: () => {
            handleDeleteSelected();
            setSelectedItems([]);
            setMultipleDelete(false);
          },
        },
      ]);
    }
  };

  const handleDeleteSelected = () => {
    currWeatherStore.deleteMultipleWeather(selectedItems);
  };

  const handleDeleteAll = () => {
    currWeatherStore.deleteAll();
    router.dismissAll();
    router.replace("./search");
  };

  const CustomHeaderLeft = () => (
    <Animated.View entering={FadeInLeft}>
      <TouchableOpacity
        onPress={handleSelecteAll}
        style={styles.selectedAllWrapper}
      >
        <MaterialIcons
          name={
            selectedItems.length === currWeatherStore.currentWeather.length
              ? "radio-button-unchecked"
              : "check-circle"
          }
          size={24}
          color={radioButtonColor}
        />

        <ThemedText color={radioButtonColor} type="defaultBold">
          Selected All
        </ThemedText>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <ThemedView flex>
      <Stack.Screen
        options={{
          headerShown: true,
          title: multipleDelete ? "" : "Location",

          headerRight() {
            return multipleDelete ? (
              <ThemedText>{selectedItems.length} selected</ThemedText>
            ) : (
              <CustomHeaderRight />
            );
          },
          headerLeft: () => {
            return multipleDelete ? <CustomHeaderLeft /> : undefined;
          },

          headerTintColor: iconColor,
          headerShadowVisible: false,
          headerTitleAlign: "left",
        }}
      />
      <LocationList
        multipleDelete={multipleDelete}
        selectedItems={selectedItems}
        handleSelectItem={handleSelectItem}
      />
      {multipleDelete && (
        <ThemedView
          style={[
            styles.footerDelete,
            {
              borderTopColor: border,
            },
          ]}
        >
          <TouchableOpacity onPress={() => setMultipleDelete(false)}>
            <ThemedText color={radioButtonColor} type="subtitle">
              CANCEL
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDeletePress}>
            <ThemedText color={radioButtonColor} type="subtitle">
              DELETE
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
    </ThemedView>
  );
};

interface LocationListProps {
  multipleDelete: boolean;
  selectedItems: number[];
  handleSelectItem: (id: number) => void;
}
const LocationList = observer(
  ({ multipleDelete, selectedItems, handleSelectItem }: LocationListProps) => {
    const { currWeatherStore: weatherStore } = useStores();
    const isFocused = useIsFocused();
    console.log("LocationList");
    const onLocationPress = (index: number, id: number) => {
      if (multipleDelete) {
        handleSelectItem(id);
        return;
      }
      weatherStore.setSelectedWeather(index);
      router.back();
    };

    return (
      isFocused && (
        <FlatList
          data={weatherStore.currentWeather}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => {
            return (
              <WeatherItem
                onLocationPress={onLocationPress}
                item={item}
                index={index}
                multipleDelete={multipleDelete}
                selectedItems={selectedItems}
              />
            );
          }}
        />
      )
    );
  }
);

export default AllLocation;

interface WeatherItemProps {
  item: CurrentWeather;
  index: number;
  multipleDelete: boolean;
  selectedItems: number[];
  onLocationPress: (index: number, id: number) => void;
}

const WeatherItem = memo(function Component({
  item,
  index,
  multipleDelete,
  selectedItems,
  onLocationPress,
}: WeatherItemProps) {
  const theme = useWeatherTheme({
    iconCode: item.weather[0].icon,
    weatherCode: item.weather[0].id,
  });
  const rippleColor = useThemeColor({}, "ripple");
  const white = Colors.dark.text;
  const { currWeatherStore } = useStores();
  return (
    <Pressable
      onPress={() => onLocationPress(index, item.id)}
      android_ripple={{
        color: rippleColor,
        foreground: true,
      }}
    >
      <ImageBackground
        source={{ uri: theme?.asset.uri }}
        style={styles.weather}
      >
        {multipleDelete && (
          <Animated.View>
            <MaterialIcons
              name={
                selectedItems.includes(item.id)
                  ? "radio-button-unchecked"
                  : "check-circle"
              }
              size={24}
              color={white}
            />
          </Animated.View>
        )}

        <View>
          <View style={styles.nameWrapper}>
            {index === currWeatherStore.selectedWeather && (
              <MaterialIcons name="location-on" size={24} color={white} />
            )}
            <ThemedText color={white}>
              {locationUtils.getName(item.location)}
            </ThemedText>
          </View>

          <ThemedText color={white} type="label">
            {locationUtils.getAddress(item.location)}
          </ThemedText>
        </View>

        <View style={{ flex: 1 }} />
        <View>
          <ThemedText color={white}>
            {temperatureUtils.formatCelcius(item.main.temp)}
          </ThemedText>
        </View>
      </ImageBackground>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  selectedAllWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    overflow: "visible",
  },
  footerDelete: {
    flexDirection: "row",
    gap: 36,
    position: "absolute",
    bottom: 0,
    justifyContent: "flex-end",
    width: "100%",
    borderTopWidth: 1,
    padding: 12,
    paddingHorizontal: 30,
  },
  nameWrapper: {
    flexDirection: "row",
  },
  headerRight: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  weather: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    gap: 12,
    backgroundColor: "white",
  },
});
