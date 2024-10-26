import { ThemedView } from "@/components";
import {
  Section,
  ThemeSetting,
  Unit,
  UpdateInterval,
} from "@/components/setting";
import LanguageSelector from "@/components/setting/LanguageSelector";
import { router, Stack } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Divider } from "react-native-paper";

const SettingScreen = () => {
  const { t } = useTranslation();
  return (
    <ThemedView flex>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t("setting.setting"),
          headerShadowVisible: false,
        }}
      />
      <Divider />
      <UpdateInterval />
      <Unit />
      <ThemeSetting />
      <LanguageSelector displayType="modal" />
      <Section
        title={t("arrange_locations.screen_title")}
        handleOpenSection={() => router.navigate("/arrange-locations")}
      />
    </ThemedView>
  );
};

export default SettingScreen;
