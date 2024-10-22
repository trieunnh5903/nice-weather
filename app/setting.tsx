import { ThemedView } from "@/components";
import {
  Section,
  ThemeSetting,
  Unit,
  UpdateInterval,
} from "@/components/setting";
import LanguageSelector from "@/components/setting/LanguageSelector";
import { Stack } from "expo-router";
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
      {/* <Section
        title="Rearrange locations"
        handleOpenSection={() => router.navigate("/rearrange-locations")}
      /> */}
      <LanguageSelector displayType="modal" />
    </ThemedView>
  );
};

export default SettingScreen;
