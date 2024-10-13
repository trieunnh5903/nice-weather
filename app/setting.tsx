import {
  Appearance,
  ColorSchemeName,
  Pressable,
  StyleSheet,
  useColorScheme,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ThemedView } from "@/components/ThemedView";
import { Stack, useFocusEffect, useNavigation } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { Divider, Modal, Portal, RadioButton } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Size } from "@/constants/Size";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useStores } from "@/hooks/useStore";
import { observer, Observer } from "mobx-react-lite";
import { useQueryClient } from "@tanstack/react-query";
import { TemperatureUnit } from "@/type";

interface SectionProps {
  title: string;
  subtitle?: string;
  handleOpenSection: () => void;
}

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
      <Theme />
    </ThemedView>
  );
};

const Unit = observer(() => {
  const [modalVisible, setModalVisible] = useState(false);
  const { weatherStore } = useStores();
  const values: { label: string; unit: TemperatureUnit }[] = useMemo(
    () => [
      {
        label: "Celsius (°C)",
        unit: "metric",
      },
      {
        label: "Fahrenheit (°F)",
        unit: "us",
      },
    ],
    []
  );
  const [checked, setChecked] = React.useState(
    values.find((item) => item.unit === weatherStore.temperatureUnit) ||
      values[0]
  );
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!modalVisible) {
      if (checked.unit !== weatherStore.temperatureUnit) {
        weatherStore.changeTemperatureUnit(checked.unit);
        queryClient.invalidateQueries({ queryKey: ["weather"] });
      }
    }
  }, [checked.unit, modalVisible, queryClient, weatherStore]);
  const handleSelectItem = (item: (typeof values)[0]) => {
    setChecked(item);
  };
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
  return (
    <ThemedView>
      <Section
        title="Temperature unit"
        subtitle={checked.label}
        handleOpenSection={showModal}
      />
      <Portal>
        <Modal
          contentContainerStyle={styles.modal}
          visible={modalVisible}
          onDismiss={hideModal}
        >
          <ThemedView padding={20} style={styles.modalContainer}>
            <ThemedView paddingBottom={20}>
              <ThemedText type="title">Temperature Unit</ThemedText>
            </ThemedView>
            <ThemedView>
              {values.map((item) => {
                return (
                  <ThemedView key={item.label}>
                    <TouchableOpacity
                      onPress={() => handleSelectItem(item)}
                      style={styles.rowCentered}
                    >
                      <RadioButton
                        value={item.label}
                        status={checked === item ? "checked" : "unchecked"}
                      />
                      <ThemedText type="defaultMedium">{item.label}</ThemedText>
                    </TouchableOpacity>
                    <ThemedView paddingVertical={6}>
                      <Divider />
                    </ThemedView>
                  </ThemedView>
                );
              })}
            </ThemedView>
            <ThemedView paddingTop={20} style={styles.rowCentered}>
              <ThemedView flex />
              <TouchableOpacity onPress={hideModal}>
                <ThemedText type="subtitle">CANCEL</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </Modal>
      </Portal>
    </ThemedView>
  );
});

const Theme = () => {
  const [visible, setVisible] = React.useState(false);
  const { weatherStore } = useStores();
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
            title="Theme"
            subtitle={
              !weatherStore.theme
                ? "Default"
                : weatherStore.theme === "dark"
                ? "Dark mode"
                : "Light mode"
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
              <ThemedText type="title">Theme</ThemedText>
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
                      <ThemedText type="defaultMedium">Dark</ThemedText>
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
                      <ThemedText type="defaultMedium">Light</ThemedText>
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
                      <ThemedText type="defaultMedium">Default</ThemedText>
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
                <ThemedText type="subtitle">CANCEL</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </Modal>
      </Portal>
    </ThemedView>
  );
};

const UpdateInterval = observer(() => {
  const timeIntervalValue = useMemo(
    () => [
      {
        label: "Manually",
        value: -1,
      },
      {
        label: "Every 1 hours",
        value: 3600,
      },
      {
        label: "Every 3 hours",
        value: 3600 * 3,
      },
      {
        label: "Every 6 hours",
        value: 3600 * 6,
      },
      {
        label: "Every 12 hours",
        value: 3600 * 12,
      },
    ],
    []
  );
  const queryClient = useQueryClient();
  const { weatherStore } = useStores();
  const [modalVisible, setModalVisible] = useState(false);
  const [timSeleted, setTimSeleted] = useState(
    timeIntervalValue.find((item) => item.value === weatherStore.stateTime)
  );

  useEffect(() => {
    if (!modalVisible && timSeleted) {
      if (timSeleted.value !== weatherStore.stateTime) {
        if (timSeleted.value === Infinity) {
          weatherStore.changeStaleTime(-1);
          queryClient.setDefaultOptions({ queries: { staleTime: Infinity } });
        } else {
          weatherStore.changeStaleTime(timSeleted.value);
          queryClient.setDefaultOptions({
            queries: { staleTime: timSeleted.value },
          });
        }
      }
    }
    return () => {};
  }, [modalVisible, queryClient, timSeleted, weatherStore]);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
  return (
    <ThemedView>
      <Section
        subtitle={timSeleted?.value === -1 ? "Manual" : timSeleted?.label}
        title="Update interval"
        handleOpenSection={showModal}
      />
      <Portal>
        <Modal
          contentContainerStyle={styles.modal}
          visible={modalVisible}
          onDismiss={hideModal}
        >
          <ThemedView padding={20} style={styles.modalContainer}>
            <ThemedView paddingBottom={20}>
              <ThemedText type="title">Update interval</ThemedText>
            </ThemedView>
            <ThemedView>
              {timeIntervalValue.map((item) => {
                return (
                  <ThemedView key={item.label}>
                    <TouchableOpacity
                      onPress={() => setTimSeleted(item)}
                      key={item.label}
                      style={styles.rowCentered}
                    >
                      <RadioButton
                        value={item.label}
                        status={
                          timSeleted?.label === item.label
                            ? "checked"
                            : "unchecked"
                        }
                      />
                      <ThemedText type="defaultMedium">{item.label}</ThemedText>
                    </TouchableOpacity>
                    <ThemedView paddingVertical={6}>
                      <Divider />
                    </ThemedView>
                  </ThemedView>
                );
              })}
            </ThemedView>
            <ThemedView paddingTop={20} style={styles.rowCentered}>
              <ThemedView flex />
              <TouchableOpacity onPress={hideModal}>
                <ThemedText type="subtitle">CANCEL</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </Modal>
      </Portal>
    </ThemedView>
  );
});

const Section = ({ handleOpenSection, subtitle, title }: SectionProps) => {
  const themeColor = useAppTheme();

  return (
    <Pressable
      onPress={handleOpenSection}
      android_ripple={{ color: themeColor.ripple, foreground: true }}
    >
      <ThemedView padding={16} paddingBottom={0}>
        <ThemedText type="defaultMedium" fontSize={16}>
          {title}
        </ThemedText>
        {subtitle && (
          <ThemedText color={themeColor.subtitleText}>{subtitle}</ThemedText>
        )}
        <ThemedView paddingTop={16}>
          <Divider />
        </ThemedView>
      </ThemedView>
    </Pressable>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  modal: { alignItems: "center" },
  rowCentered: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalContainer: { width: Size.screenWidth * 0.9, borderRadius: 12 },
});
