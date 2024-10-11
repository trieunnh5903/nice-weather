import { StyleSheet, Text } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { Stack } from "expo-router";

const SettingScreen = () => {
  return (
    <ThemedView flex>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Setting",
        }}
      />
    </ThemedView>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({});
