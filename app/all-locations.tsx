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
import { MaterialIconName, Place } from "@/type";
import { observer } from "mobx-react-lite";
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
import { CommonActions } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import provinceUtils from "@/utils/placeUtils";
import weatherUtils from "@/utils/weatherUtils";
import { Divider } from "react-native-paper";
import { useQueries } from "@tanstack/react-query";
import { weatherApi } from "@/api/weatherApi";
import { useAppTheme } from "@/hooks/useAppTheme";

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
  const themeColor = useAppTheme();
  const icons: MaterialIconName[] = ["add", "delete-outline"];
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
    if (selectedItems.length === weatherStore.places.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(weatherStore.places.map((place) => place.place_id));
    }
  };

  const onDeletePress = () => {
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
  };

  const resetNavigation = () => {
    navigation.dispatch(
      CommonActions.reset({
        routes: [{ key: "index", name: "index" }],
      })
    );
  };

  const handleDeleteSelected = () => {
    const remains = weatherStore.deleteMany(selectedItems);
    if (remains === 0) {
      resetNavigation();
    }
  };

  const handleDeleteAll = () => {
    weatherStore.deleteAll();
    resetNavigation();
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
          headerTintColor: themeColor.icon,
          headerTitleAlign: "left",
          headerShadowVisible: false,
        }}
      />
      <Divider />
      <LocationList
        progress={progress}
        multipleDelete={multipleDelete}
        selectedItems={selectedItems}
        handleSelectItem={handleSelectItem}
      />
      <ThemedView flex />
      {multipleDelete && (
        <Animated.View entering={FadeInDown} exiting={FadeOutDown}>
          <ThemedView
            style={[styles.footerDelete, { borderTopColor: themeColor.border }]}
          >
            <TouchableOpacity onPress={onCancelPress}>
              <ThemedText
                color={themeColor.primary}
                style={{ fontSize: 16 }}
                type="defaultBold"
              >
                CANCEL
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDeletePress}>
              <ThemedText
                color={themeColor.primary}
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
  const themeColor = useAppTheme();
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
    <ThemedView style={styles.centered}>
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
              <MaterialIcons name={icon} size={24} color={themeColor.primary} />
            </RippleButtonIcon>
          );
        })}
        <MaterialCommunityIcons
          name="dots-vertical"
          size={24}
          color={themeColor.primary}
        />
      </Animated.View>
    </ThemedView>
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
  const themeColor = useAppTheme();
  const radioButtonColor = themeColor.primary;
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
              selectedItems.length === weatherStore.places.length
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
    const allWeather = useQueries({
      queries: weatherStore.places.map((place) => ({
        queryKey: ["weather", place.place_id],
        queryFn: () =>
          weatherApi.fetchWeather(place.place_id, weatherStore.temperatureUnit),
      })),
    });

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
        data={weatherStore.places}
        keyExtractor={(item) => item.place_id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item, index }) => {
          const temperature = allWeather[index].data?.current.temperature;
          const formatTemp = temperature
            ? allWeather[index].data?.units === "metric"
              ? weatherUtils.formatCelcius(temperature)
              : weatherUtils.formatFahrenheit(temperature)
            : "";
          return (
            <WeatherItem
              temperature={formatTemp}
              animatedStyle={animatedStyle}
              onLocationPress={onLocationPress}
              place={item}
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
  place: Place;
  index: number;
  selectedItems: string[];
  onLocationPress: (index: number, id: string) => void;
  animatedStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  temperature: string | undefined;
}

const WeatherItem = function WeatherItem({
  place,
  index,
  selectedItems,
  animatedStyle,
  onLocationPress,
  temperature,
}: WeatherItemProps) {
  const themeColor = useAppTheme();
  const rippleColor = themeColor.ripple;
  const iconColor = themeColor.icon;
  return (
    <Pressable
      onPress={() => onLocationPress(index, place.place_id)}
      android_ripple={{
        color: rippleColor,
        foreground: true,
      }}
    >
      <ImageBackground style={styles.weather}>
        <Animated.View
          style={[styles.rowCenter, { gap: 18, flex: 1 }, animatedStyle]}
        >
          <MaterialIcons
            name={
              selectedItems.includes(place.place_id)
                ? "check-circle"
                : "radio-button-unchecked"
            }
            size={24}
            color={iconColor}
          />

          <ThemedView flex>
            <ThemedView style={styles.nameWrapper}>
              {place.isUserLocation && (
                <MaterialIcons name="location-on" size={24} color={iconColor} />
              )}
              <ThemedText>{place.name}</ThemedText>
            </ThemedView>

            <ThemedText numberOfLines={1}>
              {provinceUtils.getAddress(place)}
            </ThemedText>
          </ThemedView>
        </Animated.View>
        {temperature && (
          <ThemedView>
            <ThemedText fontSize={18}>{temperature}</ThemedText>
          </ThemedView>
        )}
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
    alignItems: "center",
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
