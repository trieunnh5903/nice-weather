import { StyleSheet } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { useQueryClient } from "@tanstack/react-query";
import { useStores } from "@/hooks";
import ThemedView from "../ThemedView";
import Section from "./Section";
import { Divider, Modal, Portal, RadioButton } from "react-native-paper";
import ThemedText from "../ThemedText";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Size } from "@/constants/size";
import { useTranslation } from "react-i18next";

const UpdateInterval = observer(() => {
  const { t } = useTranslation();
  const timeIntervalValue = useMemo(
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
        subtitle={
          timSeleted?.value === -1 ? t("setting.manually") : timSeleted?.label
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
