import { ThemedView } from "@/components";
import {
  Section,
  ThemeSetting,
  Unit,
  UpdateInterval,
} from "@/components/setting";
import { router, Stack } from "expo-router";
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
      <Divider />
      <UpdateInterval />
      <Unit />
      <ThemeSetting />
      <Section title="Rearrange locations" handleOpenSection={() => router.navigate('/rearrange-locations')}/>
    </ThemedView>
  );
};

export default SettingScreen;
