import { ThemedView } from "@/components/common/Themed";
import {
  Section,
  ThemeSetting,
  Unit,
  UpdateInterval,
} from "@/components/setting";
import LanguageSelector from "@/components/setting/LanguageSelector";
import { router, useNavigation } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Divider } from "react-native-paper";

const SettingScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  React.useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: t("setting.setting"),
      headerShadowVisible: false,
    });
  }, [navigation, t]);
  return (
    <ThemedView flex>
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
