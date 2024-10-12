import {
  Appearance,
  ColorSchemeName,
  Pressable,
  StyleSheet,
  useColorScheme,
} from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { Stack } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { Divider, Modal, Portal, RadioButton } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Size } from "@/constants/Size";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useStores } from "@/hooks/useStore";
import { Observer } from "mobx-react-lite";

interface SectionProps {
  title: string;
  subtitle?: string;
  onPress: () => void;
}

const SettingScreen = () => {
  const { weatherStore } = useStores();
  const [visible, setVisible] = React.useState(0);
  const showModal = (value: number) => setVisible(value);
  const hideModal = () => setVisible(0);
  const theme = useColorScheme();
  return (
    <ThemedView flex>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Setting",
        }}
      />

      <Section
        subtitle="Every 1 hour"
        title="Update interval"
        onPress={() => showModal(1)}
      />

      <Section
        title="Temperature unit"
        subtitle="Celcius"
        onPress={() => showModal(2)}
      />

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
            onPress={() => showModal(3)}
          />
        )}
      </Observer>

      <Portal>
        <Modal
          contentContainerStyle={{ alignItems: "center" }}
          visible={visible === 1}
          onDismiss={hideModal}
        >
          <UpdateInterval hideModal={hideModal} />
        </Modal>
      </Portal>
      <Portal>
        <Modal
          contentContainerStyle={{ alignItems: "center" }}
          visible={visible === 2}
          onDismiss={hideModal}
        >
          <UnitModal hideModal={hideModal} />
        </Modal>
      </Portal>
      <Portal>
        <Modal
          contentContainerStyle={{ alignItems: "center" }}
          visible={visible === 3}
          onDismiss={hideModal}
        >
          <ThemeModal hideModal={hideModal} />
        </Modal>
      </Portal>
    </ThemedView>
  );
};

const ThemeModal = ({ hideModal }: { hideModal: () => void }) => {
  const systemTheme = useColorScheme();
  const { weatherStore } = useStores();
  const handleChangeTheme = (theme: ColorSchemeName) => {
    Appearance.setColorScheme(theme);
    weatherStore.changeTheme(theme);
    console.log("theme", weatherStore.theme);
    console.log("systemTheme", systemTheme);
  };
  return (
    <ThemedView padding={20} style={styles.modal}>
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
                    weatherStore.theme === "dark" ? "checked" : "unchecked"
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
                    weatherStore.theme === "light" ? "checked" : "unchecked"
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
  );
};

const UnitModal = ({ hideModal }: { hideModal: () => void }) => {
  const values = ["Celsius (°C)", "Fahrenheit (°F)"];
  const [checked, setChecked] = React.useState(values[0]);
  return (
    <ThemedView padding={20} style={styles.modal}>
      <ThemedView paddingBottom={20}>
        <ThemedText type="title">Update interval</ThemedText>
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
          <ThemedText type="subtitle">CANCEL</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

const UpdateInterval = ({ hideModal }: { hideModal: () => void }) => {
  const values = [
    "Manually",
    "Every 1 hours",
    "Every 3 hours",
    "Every 6 hours",
    "Every 12 hours",
  ];
  const [checked, setChecked] = React.useState(values[1]);

  return (
    <ThemedView padding={20} style={styles.modal}>
      <ThemedView paddingBottom={20}>
        <ThemedText type="title">Update interval</ThemedText>
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
          <ThemedText type="subtitle">CANCEL</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

const Section = ({ onPress, subtitle, title }: SectionProps) => {
  const themeColor = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
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
  rowCentered: {
    flexDirection: "row",
    alignItems: "center",
  },
  modal: { width: Size.screenWidth * 0.9, borderRadius: 12 },
});
