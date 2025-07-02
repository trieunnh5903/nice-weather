import { Appearance, ColorSchemeName, StyleSheet } from "react-native";
import React, { useState } from "react";
import ThemedView from "../common/Themed/ThemedView";
import { observer } from "mobx-react-lite";
import Section from "./Section";
import { Divider, Modal, Portal, RadioButton } from "react-native-paper";
import ThemedText from "../common/Themed/ThemedText";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Size } from "@/constants/size";
import { useTranslation } from "react-i18next";
import { useStores } from "@/hooks/common";

const themeOptions: {
  label: string;
  value: ColorSchemeName;
  key: string;
}[] = [
  { key: "dark", label: "setting.dark", value: "dark" },
  { key: "light", label: "setting.light", value: "light" },
  { key: "default", label: "setting.default", value: null },
];

const ThemeSetting = observer(() => {
  const [visible, setVisible] = useState(false);
  const { weatherStore } = useStores();
  const { t } = useTranslation();

  const currentValue = weatherStore.theme;

  const handleChangeTheme = (theme: ColorSchemeName) => {
    Appearance.setColorScheme(theme);
    weatherStore.changeTheme(theme);
  };

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const getSubtitle = () => {
    const option = themeOptions.find((o) => o.value === currentValue);
    return option ? t(option.label as any) : t("setting.default");
  };

  return (
    <ThemedView>
      <Section
        title={t("setting.theme")}
        subtitle={getSubtitle()}
        handleOpenSection={showModal}
      />
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}
          testID="theme-modal"
        >
          <ThemedView padding={20} style={styles.modalContainer}>
            <ThemedView paddingBottom={20}>
              <ThemedText type="title">{t("setting.theme")}</ThemedText>
            </ThemedView>

            <ThemedView>
              {themeOptions.map((item) => (
                <ThemedView key={item.key}>
                  <TouchableOpacity
                    onPress={() => handleChangeTheme(item.value)}
                    style={styles.rowCentered}
                    testID={`theme-option-${item.key}`}
                  >
                    <RadioButton
                      value={item.key}
                      status={
                        currentValue === item.value ? "checked" : "unchecked"
                      }
                    />
                    <ThemedText type="defaultMedium">
                      {t(item.label as any)}
                    </ThemedText>
                  </TouchableOpacity>
                  <ThemedView paddingVertical={6}>
                    <Divider />
                  </ThemedView>
                </ThemedView>
              ))}
            </ThemedView>

            <ThemedView paddingTop={20} style={styles.rowCentered}>
              <ThemedView flex />
              <TouchableOpacity onPress={hideModal}>
                <ThemedText type="subtitle">{t("setting.cancel")}</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </Modal>
      </Portal>
    </ThemedView>
  );
});

export default ThemeSetting;

const styles = StyleSheet.create({
  modal: { alignItems: "center" },
  rowCentered: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalContainer: { width: Size.screenWidth * 0.9, borderRadius: 12 },
});
