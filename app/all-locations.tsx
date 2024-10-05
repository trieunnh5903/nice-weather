import {
  Alert,
  Pressable,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React, { memo, useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { router, Stack, useNavigation } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CurrentWeather, MaterialIconName, Place } from "@/type";
import { observer } from "mobx-react-lite";
import { useWeatherTheme } from "@/hooks/useWeatherTheme";
import { ImageBackground } from "expo-image";
import RippleButtonIcon from "@/components/RippleButtonIcon";
import Animated, {
  AnimatedStyle,
  Easing,
  FadeInDown,
  FadeOutDown,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useStores } from "@/hooks/useStore";
import { FlatList } from "react-native-gesture-handler";
import { CommonActions, useIsFocused } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import provinceUtils from "@/utils/placeUtils";
import weatherUtils from "@/utils/weatherUtils";

interface CustomHeaderRightProps {
  icons: MaterialIconName[];
  onHeaderPress: (icon: MaterialIconName) => void;
  numberOfSelected: number;
  progress: SharedValue<number>;
  multipleDelete: boolean;
}

interface LocationListProps {
  multipleDelete: boolean;
  selectedItems: string[];
  handleSelectItem: (id: string) => void;
  progress: SharedValue<number>;
}

const AllLocation = () => {
  console.log("AllLocation");
  const { weatherStore } = useStores();
  const iconColor = useThemeColor("tint");
  const icons: MaterialIconName[] = ["add", "delete-outline"];
  const radioButtonColor = useThemeColor("tint");
  const border = useThemeColor("ripple");
  const [multipleDelete, setMultipleDelete] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const progress = useSharedValue(0);
  const navigation = useNavigation();

  const onHeaderPress = (icon: MaterialIconName) => {
    switch (icon) {
      case icons[0]:
        router.navigate("./search");
        break;
      case icons[1]:
        setMultipleDelete(true);
        break;
      default:
        break;
    }
  };

  const onCancelPress = () => {
    setMultipleDelete(false);
  };

  useEffect(() => {
    if (multipleDelete) {
      progress.value = withTiming(1, {
        duration: 1000,
        easing: Easing.out(Easing.exp),
      });
    } else {
      progress.value = withTiming(0, {
        duration: 1000,
        easing: Easing.out(Easing.exp),
      });
    }
  }, [multipleDelete, progress]);

  const handleSelectItem = (id: string) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((item) => item !== id)
        : [...prevSelectedItems, id]
    );
  };

  const handleSelecteAll = () => {
    if (selectedItems.length === weatherStore.allPlaceIds.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(weatherStore.allPlaceIds);
    }
  };

  const onDeletePress = () => {
    if (selectedItems.length === 0) return;

    Alert.alert("", "Delete this location?", [
      { text: "Cancel" },
      {
        text: "OK",
        onPress: () => {
          if (selectedItems.length === weatherStore.allPlaceIds.length) {
            handleDeleteAll();
          } else {
            handleDeleteSelected();
            setSelectedItems([]);
            setMultipleDelete(false);
          }
        },
      },
    ]);
  };

  const resetNavigation = () => {
    navigation.dispatch(
      CommonActions.reset({
        routes: [{ key: "index", name: "index" }],
      })
    );
  };

  const handleDeleteSelected = () => {
    // const remains = weatherStore.deleteMany(selectedItems);
    // if (remains === 0) {
    //   resetNavigation();
    // }
  };

  const handleDeleteAll = () => {
    // weatherStore.deleteAll();
    // resetNavigation();
  };

  return (
    <ThemedView flex>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "",
          headerRight() {
            return (
              <CustomHeaderRight
                multipleDelete={multipleDelete}
                icons={icons}
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
          headerTintColor: iconColor,
          headerShadowVisible: false,
          headerTitleAlign: "left",
        }}
      />
      <LocationList
        progress={progress}
        multipleDelete={multipleDelete}
        selectedItems={selectedItems}
        handleSelectItem={handleSelectItem}
      />
      <View style={{ flex: 1 }} />
      {multipleDelete && (
        <Animated.View entering={FadeInDown} exiting={FadeOutDown}>
          <ThemedView style={[styles.footerDelete, { borderTopColor: border }]}>
            <TouchableOpacity onPress={onCancelPress}>
              <ThemedText
                color={radioButtonColor}
                style={{ fontSize: 16 }}
                type="defaultBold"
              >
                CANCEL
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDeletePress}>
              <ThemedText
                color={radioButtonColor}
                style={{ fontSize: 16 }}
                type="defaultBold"
              >
                DELETE
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </Animated.View>
      )}
    </ThemedView>
  );
};

const CustomHeaderRight = memo(function CustomHeaderRight({
  icons,
  onHeaderPress,
  numberOfSelected,
  progress,
  multipleDelete,
}: CustomHeaderRightProps) {
  const iconColor = useThemeColor("tint");

  const selectedAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
    };
  });

  const optionAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 0.1], [1, 0]),
    };
  });

  return (
    <View style={styles.centered}>
      <Animated.View style={selectedAnimatedStyle}>
        <ThemedText>{numberOfSelected} selected</ThemedText>
      </Animated.View>

      <Animated.View
        pointerEvents={multipleDelete ? "none" : "auto"}
        style={[styles.headerRight, optionAnimatedStyle]}
      >
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
      </Animated.View>
    </View>
  );
});

interface CustomHeaderLeftProps {
  handleSelecteAll: () => void;
  selectedItems: string[];
  progress: SharedValue<number>;
}
const CustomHeaderLeft = memo(function CustomHeaderLeft({
  handleSelecteAll,
  selectedItems,
  progress,
}: CustomHeaderLeftProps) {
  const radioButtonColor = useThemeColor("tint");
  const { weatherStore } = useStores();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: interpolate(progress.value, [0, 1], [-200, 0]) },
      ],
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 0.1], [1, 0]),
    };
  });

  const onBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={styles.rowCenter}>
      <StatusBar style="auto" />
      <Animated.View style={[styles.rowCenter, backAnimatedStyle]}>
        <RippleButtonIcon onPress={onBackPress}>
          <MaterialIcons name="arrow-back" size={24} color={radioButtonColor} />
        </RippleButtonIcon>
        <ThemedText type="title">Location</ThemedText>
      </Animated.View>
      <Animated.View style={[{ position: "absolute" }, animatedStyle]}>
        <TouchableOpacity
          onPress={handleSelecteAll}
          style={styles.selectedAllWrapper}
        >
          <MaterialIcons
            name={
              selectedItems.length === weatherStore.allPlaceIds.length
                ? "check-circle"
                : "radio-button-unchecked"
            }
            size={24}
            color={radioButtonColor}
          />

          <ThemedText type="defaultBold" color={radioButtonColor}>
            Selected All
          </ThemedText>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
});

const LocationList = observer(
  ({
    multipleDelete,
    selectedItems,
    handleSelectItem,
    progress,
  }: LocationListProps) => {
    const { weatherStore } = useStores();
    console.log("LocationList");
    const onLocationPress = (index: number, id: string) => {
      if (multipleDelete) {
        handleSelectItem(id);
        return;
      }
      weatherStore.setSelectedIndex(index);
      router.back();
    };

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: interpolate(progress.value, [0, 1], [-42, 0]) },
        ],
      };
    });

    return (
      <FlatList
        data={weatherStore.allPlace}
        keyExtractor={(item) => item.place.place_id}
        renderItem={({ item, index }) => {
          return (
            <WeatherItem
              animatedStyle={animatedStyle}
              onLocationPress={onLocationPress}
              item={item}
              index={index}
              selectedItems={selectedItems}
            />
          );
        }}
      />
    );
  }
);

export default AllLocation;

interface WeatherItemProps {
  item: {
    place: Place;
    currentWeather: CurrentWeather;
  };
  index: number;
  selectedItems: string[];
  onLocationPress: (index: number, id: string) => void;
  animatedStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}

const WeatherItem = function WeatherItem({
  item: { currentWeather, place },
  index,
  selectedItems,
  animatedStyle,
  onLocationPress,
}: WeatherItemProps) {
  // const theme = useWeatherTheme({
  //   iconCode: currentWeather.weather[0].icon,
  //   weatherCode: currentWeather.weather[0].id,
  // });
  // const textColor = theme?.textColor;
  // const itemId = provinceUtils.getId(province);
  const rippleColor = useThemeColor("ripple");
  const iconColor = useThemeColor("icon");
  return (
    <Pressable
      onPress={() => onLocationPress(index, place.place_id)}
      android_ripple={{
        color: rippleColor,
        foreground: true,
      }}
    >
      <ImageBackground style={styles.weather}>
        <Animated.View style={[styles.rowCenter, { gap: 18 }, animatedStyle]}>
          <MaterialIcons
            name={
              selectedItems.includes(place.place_id)
                ? "check-circle"
                : "radio-button-unchecked"
            }
            size={24}
            color={iconColor}
          />

          <View>
            <View style={styles.nameWrapper}>
              {place.isUserLocation && (
                <MaterialIcons name="location-on" size={24} color={iconColor} />
              )}
              <ThemedText>{place.name}</ThemedText>
            </View>

            <ThemedText>{provinceUtils.getAddress(place)}</ThemedText>
          </View>
        </Animated.View>
        <View style={{ flex: 1 }} />
        <View>
          <ThemedText style={{ fontSize: 18 }}>
            {weatherUtils.formatCelcius(currentWeather.temperature)}
          </ThemedText>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  selectedAllWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  footerDelete: {
    flexDirection: "row",
    gap: 36,
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
    position: "absolute",
    right: 0,
  },
  weather: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    // backgroundColor: 'red'
  },
});
