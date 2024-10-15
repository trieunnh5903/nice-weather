import { ThemedView } from "@/components";
import { ThemeSetting, Unit, UpdateInterval } from "@/components/setting";
import { Stack } from "expo-router";
import React from "react";
import { Divider } from "react-native-paper";

const SettingScreen = () => {
  return (
    <ThemedView flex>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Setting",
          headerShadowVisible: false,
        }}
      />
      <Divider/>
      <UpdateInterval />
      <Unit />
      <ThemeSetting />
    </ThemedView>
  );
};

export default SettingScreen;
