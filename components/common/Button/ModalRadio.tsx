import { StyleSheet } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Divider, RadioButton } from "react-native-paper";
import { Size } from "@/constants/size";
import { ThemedText, ThemedView } from "../Themed";

const themeOptions = ["Dark", "Light", "Auto"];
const ModalRadio = ({ hideModal }: { hideModal: () => void }) => {
  const [checked, setChecked] = React.useState(themeOptions[0]);
  return (
    <ThemedView padding={20} style={styles.modal}>
      <ThemedView paddingBottom={20}>
        <ThemedText type="title">Theme</ThemedText>
      </ThemedView>
      <ThemedView>
        {themeOptions.map((item) => {
          return (
            <ThemedView key={item}>
              <TouchableOpacity
                testID={`theme-option-${item.toLowerCase()}`}
                onPress={() => setChecked(item)}
                style={styles.rowCentered}
              >
                <RadioButton
                  testID={`radio-${item.toLowerCase()}`}
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
