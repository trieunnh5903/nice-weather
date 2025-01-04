import { StyleSheet } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStores } from "@/hooks";
import { TemperatureUnit } from "@/type";
import { useQueryClient } from "@tanstack/react-query";
import ThemedView from "../ThemedView";
import { Divider, Modal, Portal, RadioButton } from "react-native-paper";
import ThemedText from "../ThemedText";
import { TouchableOpacity } from "react-native-gesture-handler";
import Section from "./Section";
import { Size } from "@/constants/Size";
import { useTranslation } from "react-i18next";

const Unit = observer(() => {
  const [modalVisible, setModalVisible] = useState(false);
  const { weatherStore } = useStores();
  const { t } = useTranslation();
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
        title={t("setting.temperature_unit")}
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
              <ThemedText type="title">
                {t("setting.temperature_unit")}
              </ThemedText>
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
                <ThemedText type="subtitle"> {t("setting.cancel")}</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </Modal>
      </Portal>
    </ThemedView>
  );
});

export default Unit;

const styles = StyleSheet.create({
  modal: { alignItems: "center" },
  rowCentered: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalContainer: { width: Size.screenWidth * 0.9, borderRadius: 12 },
});
