import { StyleSheet } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import ThemedView from "../common/Themed/ThemedView";
import { Divider, Modal, Portal, RadioButton } from "react-native-paper";
import ThemedText from "../common/Themed/ThemedText";
import { TouchableOpacity } from "react-native-gesture-handler";
import Section from "./Section";
import { Size } from "@/constants/size";
import { useTranslation } from "react-i18next";
import { TemperatureUnit } from "@/types/common/unit";
import { useStores } from "@/hooks/common";

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
  const [selectedUnit, setSelectedUnit] = React.useState(
    values.find((item) => item.unit === weatherStore.temperatureUnit) ||
      values[0]
  );

  useEffect(() => {
    if (!modalVisible && selectedUnit.unit !== weatherStore.temperatureUnit) {
      weatherStore.changeTemperatureUnit(selectedUnit.unit);
    }
  }, [selectedUnit.unit, modalVisible, weatherStore]);

  return (
    <ThemedView>
      <Section
        title={t("setting.temperature_unit")}
        subtitle={selectedUnit.label}
        handleOpenSection={() => setModalVisible(true)}
      />
      <Portal>
        <Modal
          contentContainerStyle={styles.modal}
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
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
                      onPress={() => setSelectedUnit(item)}
                      style={styles.rowCentered}
                    >
                      <RadioButton
                        value={item.label}
                        status={
                          selectedUnit.unit === item.unit
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
              <TouchableOpacity onPress={() => setModalVisible(false)}>
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
