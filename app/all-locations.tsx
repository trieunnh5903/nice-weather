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
import Animated, {
  AnimatedStyle,
  Easing,
  FadeInDown,
  FadeOutDown,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useStores } from "@/hooks/useStore";
import { FlatList } from "react-native-gesture-handler";
import { useIsFocused } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";

const AllLocation = () => {
  const { currWeatherStore } = useStores();
  const iconColor = useThemeColor({}, "tint");
  const icons: MaterialIconName[] = ["add", "delete-outline"];
  const radioButtonColor = useThemeColor({}, "tint");
  const border = useThemeColor({}, "ripple");
  const [multipleDelete, setMultipleDelete] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const progress = useSharedValue(0);

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

  const handleSelectItem = (id: number) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((item) => item !== id)
        : [...prevSelectedItems, id]
    );
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

  return (
    <ThemedView flex>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "",
          headerRight() {
            return (
              <CustomHeaderRight
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
      {multipleDelete && (
        <Animated.View entering={FadeInDown} exiting={FadeOutDown}>
          <ThemedView
            style={[
              styles.footerDelete,
              {
                borderTopColor: border,
              },
            ]}
          >
            <TouchableOpacity onPress={onCancelPress}>
              <ThemedText color={radioButtonColor} type="defaultBold">
                CANCEL
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDeletePress}>
              <ThemedText color={radioButtonColor} type="defaultBold">
                DELETE
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </Animated.View>
      )}
    </ThemedView>
  );
};

interface CustomHeaderRightProps {
  icons: MaterialIconName[];
  onHeaderPress: (icon: MaterialIconName) => void;
  numberOfSelected: number;
  progress: SharedValue<number>;
}

const CustomHeaderRight = memo(function CustomHeaderRight({
  icons,
  onHeaderPress,
  numberOfSelected,
  progress,
}: CustomHeaderRightProps) {
  const iconColor = useThemeColor({}, "tint");

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

  const pointerEnvents = useDerivedValue(() => {
    return progress.value === 0 ? "auto" : "none";
  });
  return (
    <View style={styles.centered}>
      <Animated.View style={selectedAnimatedStyle}>
        <ThemedText>{numberOfSelected} selected</ThemedText>
      </Animated.View>

      <Animated.View
        pointerEvents={pointerEnvents}
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
  selectedItems: number[];
  progress: SharedValue<number>;
}
const CustomHeaderLeft = memo(function CustomHeaderLeft({
  handleSelecteAll,
  selectedItems,
  progress,
}: CustomHeaderLeftProps) {
  const radioButtonColor = useThemeColor({}, "tint");
  const { currWeatherStore } = useStores();
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
              selectedItems.length === currWeatherStore.currentWeather.length
                ? "check-circle"
                : "radio-button-unchecked"
            }
            size={24}
            color={radioButtonColor}
          />

          <ThemedText color={radioButtonColor} type="defaultBold">
            Selected All
          </ThemedText>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
});

interface LocationListProps {
  multipleDelete: boolean;
  selectedItems: number[];
  handleSelectItem: (id: number) => void;
  progress: SharedValue<number>;
}

const LocationList = observer(
 ({
    multipleDelete,
    selectedItems,
    handleSelectItem,
    progress,
  }: LocationListProps) => {
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

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: interpolate(progress.value, [0, 1], [-42, 0]) },
        ],
      };
    });

    return (
      isFocused && (
        <FlatList
          data={weatherStore.currentWeather}
          keyExtractor={(item) => item.id.toString()}
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
      )
    );
  })

export default AllLocation;

interface WeatherItemProps {
  item: CurrentWeather;
  index: number;
  selectedItems: number[];
  onLocationPress: (index: number, id: number) => void;
  animatedStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}

const WeatherItem = memo(function Component({
  item,
  index,
  selectedItems,
  animatedStyle,
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
        <Animated.View
          style={[
            { flexDirection: "row", alignItems: "center", gap: 18 },
            animatedStyle,
          ]}
        >
          <MaterialIcons
            name={
              selectedItems.includes(item.id)
                ? "check-circle"
                : "radio-button-unchecked"
            }
            size={24}
            color={white}
          />

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
        </Animated.View>
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
    position: "absolute",
  },
  weather: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    // gap: 18,
  },
});
