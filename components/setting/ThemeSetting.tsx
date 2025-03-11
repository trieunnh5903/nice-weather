import { Appearance, ColorSchemeName, StyleSheet } from "react-native";
import React from "react";
import { useStores } from "@/hooks";
import ThemedView from "../ThemedView";
import { Observer } from "mobx-react-lite";
import Section from "./Section";
import { Divider, Modal, Portal, RadioButton } from "react-native-paper";
import ThemedText from "../ThemedText";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Size } from "@/constants/size";
import { useTranslation } from "react-i18next";

const ThemeSetting = () => {
  const [visible, setVisible] = React.useState(false);
  const { weatherStore } = useStores();
  const { t } = useTranslation();
  const handleChangeTheme = (theme: ColorSchemeName) => {
    Appearance.setColorScheme(theme);
    weatherStore.changeTheme(theme);
  };
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  return (
    <ThemedView>
      <Observer>
        {() => (
          <Section
            title={t("setting.theme")}
            subtitle={
              !weatherStore.theme
                ? t("setting.default")
                : weatherStore.theme === "dark"
                ? t("setting.dark_mode")
                : t("setting.light_mode")
            }
            handleOpenSection={showModal}
          />
        )}
      </Observer>
      <Portal>
        <Modal
          contentContainerStyle={styles.modal}
          visible={visible}
          onDismiss={hideModal}
        >
          <ThemedView padding={20} style={styles.modalContainer}>
            <ThemedView paddingBottom={20}>
              <ThemedText type="title">{t("setting.theme")}</ThemedText>
            </ThemedView>
            <ThemedView>
              <Observer>
                {() => (
                  <ThemedView>
                    <TouchableOpacity
                      onPress={() => handleChangeTheme("dark")}
                      style={styles.rowCentered}
                    >
                      <RadioButton
                        value={"item1"}
                        status={
                          weatherStore.theme === "dark"
                            ? "checked"
                            : "unchecked"
                        }
                      />
                      <ThemedText type="defaultMedium">
                        {t("setting.dark")}
                      </ThemedText>
                    </TouchableOpacity>
                    <ThemedView paddingVertical={6}>
                      <Divider />
                    </ThemedView>
                  </ThemedView>
                )}
              </Observer>

              <Observer>
                {() => (
                  <ThemedView>
                    <TouchableOpacity
                      onPress={() => handleChangeTheme("light")}
                      style={styles.rowCentered}
                    >
                      <RadioButton
                        value={"item2"}
                        status={
                          weatherStore.theme === "light"
                            ? "checked"
                            : "unchecked"
                        }
                      />
                      <ThemedText type="defaultMedium">
                        {t("setting.light")}
                      </ThemedText>
                    </TouchableOpacity>
                    <ThemedView paddingVertical={6}>
                      <Divider />
                    </ThemedView>
                  </ThemedView>
                )}
              </Observer>

              <Observer>
                {() => (
                  <ThemedView>
                    <TouchableOpacity
                      onPress={() => handleChangeTheme(null)}
                      style={styles.rowCentered}
                    >
                      <RadioButton
                        value={"item3"}
                        status={!weatherStore.theme ? "checked" : "unchecked"}
                      />
                      <ThemedText type="defaultMedium">
                        {t("setting.default")}
                      </ThemedText>
                    </TouchableOpacity>
                    <ThemedView paddingVertical={6}>
                      <Divider />
                    </ThemedView>
                  </ThemedView>
                )}
              </Observer>
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
};

export default ThemeSetting;

const styles = StyleSheet.create({
  modal: { alignItems: "center" },
  rowCentered: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalContainer: { width: Size.screenWidth * 0.9, borderRadius: 12 },
});
