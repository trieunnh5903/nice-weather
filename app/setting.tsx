import { ThemedView } from "@/components";
import { ThemeSetting, Unit, UpdateInterval } from "@/components/setting";
import { Stack } from "expo-router";
import React from "react";

const SettingScreen = () => {
  return (
    <ThemedView flex>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Setting",
        }}
      />
      <UpdateInterval />
      <Unit />
      <ThemeSetting />
    </ThemedView>
  );
};

export default SettingScreen;
