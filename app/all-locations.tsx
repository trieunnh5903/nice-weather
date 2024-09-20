import { Alert, Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { router, Stack } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CurrentWeather, Location, MaterialIconName } from "@/type";
import { observer, Observer } from "mobx-react-lite";
import weatherStore from "@/stores/weatherStore";
import locationUtils from "@/utils/locationUtils";
import temperatureUtils from "@/utils/temperatureUtils";
import { TouchableRipple } from "react-native-paper";
import { useWeatherTheme } from "@/hooks/useWeatherTheme";
import { ImageBackground } from "expo-image";
import { BorderlessButton, RectButton } from "react-native-gesture-handler";

const AllLocation = () => {
  const iconColor = useThemeColor({}, "tint");
  const icons: MaterialIconName[] = ["add", "delete-outline"];

  const onHeaderPress = (icon: MaterialIconName) => {
    switch (icon) {
      case icons[0]:
        // router.navigate("./search");
        break;

      default:
        break;
    }
  };
  const CustomHeaderRight = () => {
    return (
      <ThemedView style={styles.headerRight}>
        {icons.map((icon) => {
          return (
            <BorderlessButton
              rippleColor={"#000"}
              onPress={() => onHeaderPress(icon)}
              key={"header" + icon}
            >
              <View
                style={{
                  paddingHorizontal: 6,
                  width: 30,
                  height: 30,
                  overflow: "hidden",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name={icon} size={24} color={iconColor} />
              </View>
            </BorderlessButton>
          );
        })}
        <MaterialCommunityIcons
          name="dots-vertical"
          size={24}
          color={iconColor}
        />
      </ThemedView>
    );
  };
  return (
    <ThemedView flex>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Location",
          headerRight(props) {
            return <CustomHeaderRight />;
          },
          headerTintColor: iconColor,
          headerShadowVisible: false,
          headerTitleAlign: "left",
        }}
      />
      <LocationList />
    </ThemedView>
  );
};

const LocationList = observer(() => {
  const rippleColor = useThemeColor({}, "ripple");
  const onLocationPress = (index: number) => {
    weatherStore.setSelectedWeather(index);
    // router.back();
  };
  return weatherStore.currentWeather.map((region, index) => {
    const { location, weather } = region;
    const theme = useWeatherTheme({
      iconCode: weather[0].icon,
      weatherCode: weather[0].id,
    });

    return (
      <View key={region.id}>
        <Pressable
          android_ripple={{
            color: rippleColor,
            foreground: true,
          }}
        >
          <ImageBackground
            source={{ uri: theme?.asset.uri }}
            style={styles.weather}
          >
            <View>
              <View style={styles.nameWrapper}>
                {index === weatherStore.selectedWeather && (
                  <MaterialIcons
                    name="location-on"
                    size={24}
                    color={theme?.textColor}
                  />
                )}
                <ThemedText color={theme?.textColor}>
                  {locationUtils.getName(location)}
                </ThemedText>
              </View>

              <ThemedText color={theme?.textColor} type="label">
                {locationUtils.getAddress(location)}
              </ThemedText>
            </View>
            <View>
              <ThemedText color={theme?.textColor}>
                {temperatureUtils.formatCelcius(region.main.temp)}
              </ThemedText>
            </View>
          </ImageBackground>
        </Pressable>
      </View>
    );
  });
});

export default AllLocation;

const styles = StyleSheet.create({
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
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    backgroundColor: "black",
  },
});
