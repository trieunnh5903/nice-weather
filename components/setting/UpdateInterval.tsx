import { StyleSheet } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { useQueryClient } from "@tanstack/react-query";
import ThemedView from "../common/Themed/ThemedView";
import Section from "./Section";
import { Divider, Modal, Portal, RadioButton } from "react-native-paper";
import ThemedText from "../common/Themed/ThemedText";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { Size } from "@/constants/size";
import { useStores } from "@/hooks/common";

const UpdateInterval = observer(() => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { weatherStore } = useStores();

  const timeIntervalOptions = useMemo(
    () => [
      {
        label: t("setting.manually"),
        value: -1,
      },
      {
        label: t("setting.every_1_hours"),
        value: 3600,
      },
      {
        label: t("setting.every_3_hours"),
        value: 3600 * 3,
      },
      {
        label: t("setting.every_6_hours"),
        value: 3600 * 6,
      },
      {
        label: t("setting.every_12_hours"),
        value: 3600 * 12,
      },
    ],
    [t]
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(
    timeIntervalOptions.findIndex(
      (item) => item.value === weatherStore.stateTime
    )
  );

  const updateStaleTime = React.useCallback(() => {
    const selected = timeIntervalOptions[selectedTimeIndex];
    if (selected.value !== weatherStore.stateTime) {
      weatherStore.changeStaleTime(selected.value);

      queryClient.setDefaultOptions({
        queries: {
          staleTime: selected.value === -1 ? Infinity : selected.value,
        },
      });
    }
  }, [selectedTimeIndex, timeIntervalOptions, weatherStore, queryClient]);

  useEffect(() => {
    if (!modalVisible && selectedTimeIndex !== -1) {
      updateStaleTime();
    }
    return () => {};
  }, [modalVisible, selectedTimeIndex, updateStaleTime]);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
  return (
    <ThemedView>
      <Section
        subtitle={
          timeIntervalOptions[selectedTimeIndex].value === -1
            ? t("setting.manually")
            : timeIntervalOptions[selectedTimeIndex].label
        }
        title={t("setting.update_interval")}
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
                {t("setting.update_interval")}
              </ThemedText>
            </ThemedView>
            <ThemedView>
              {timeIntervalOptions.map((item, index) => {
                return (
                  <ThemedView key={item.label}>
                    <TouchableOpacity
                      onPress={() => setSelectedTimeIndex(index)}
                      key={item.label}
                      style={styles.rowCentered}
                    >
                      <RadioButton
                        value={item.label}
                        status={
                          selectedTimeIndex === index ? "checked" : "unchecked"
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
                <ThemedText type="subtitle">{t("setting.cancel")}</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </Modal>
      </Portal>
    </ThemedView>
  );
});

export default UpdateInterval;

const styles = StyleSheet.create({
  modal: { alignItems: "center" },
  rowCentered: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalContainer: { width: Size.screenWidth * 0.9, borderRadius: 12 },
});
