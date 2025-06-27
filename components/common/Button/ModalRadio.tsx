import { StyleSheet } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Divider, RadioButton } from "react-native-paper";
import { Size } from "@/constants/size";
import { ThemedText, ThemedView } from "../Themed";

const ModalRadio = ({ hideModal }: { hideModal: () => void }) => {
  const values = ["Dark", "Light", "Auto"];
  const [checked, setChecked] = React.useState(values[0]);
  return (
    <ThemedView padding={20} style={styles.modal}>
      <ThemedView paddingBottom={20}>
        <ThemedText type="title">Theme</ThemedText>
      </ThemedView>
      <ThemedView>
        {values.map((item) => {
          return (
            <ThemedView key={item}>
              <TouchableOpacity
                onPress={() => setChecked(item)}
                key={item}
                style={styles.rowCentered}
              >
                <RadioButton
                  value={item}
                  status={checked === item ? "checked" : "unchecked"}
                />
                <ThemedText type="defaultMedium">{item}</ThemedText>
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
          <ThemedText type="title">CANCEL</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

export default ModalRadio;

const styles = StyleSheet.create({
  rowCentered: {
    flexDirection: "row",
    alignItems: "center",
  },
  modal: { width: Size.screenWidth * 0.9, borderRadius: 12 },
});
