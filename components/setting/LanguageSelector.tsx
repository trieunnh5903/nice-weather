import { ThemedText, ThemedView } from "@/components";
import { LanguageCode, LANGUAGES } from "@/constants/languages";
import { useAppTheme, useLanguage } from "@/hooks";
import { Stack } from "expo-router";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import Section from "./Section";
import { Divider, Portal } from "react-native-paper";
import { useTranslation } from "react-i18next";
interface LanguageItemProps {
  languageCode: LanguageCode;
  isSelected: boolean;
  onSelect: (code: LanguageCode) => void;
}

const LanguageItem = ({
  languageCode,
  isSelected,
  onSelect,
}: LanguageItemProps) => {
  const language = LANGUAGES[languageCode];
  const appTheme = useAppTheme();
  return (
    <Pressable
      style={[
        styles.languageItem,
        isSelected && { backgroundColor: appTheme.onBackground },
      ]}
      onPress={() => onSelect(languageCode)}
    >
      <Text style={styles.flag}>{language.flag}</Text>
      <View style={styles.languageInfo}>
        <ThemedText style={styles.languageName}>{language.name}</ThemedText>
        <Text style={styles.nativeName}>{language.nativeName}</Text>
      </View>
      {isSelected && <Text style={styles.checkmark}>✓</Text>}
    </Pressable>
  );
};

interface LanguageSelectorProps {
  displayType?: "modal" | "inline";
  showFlags?: boolean;
  showNativeNames?: boolean;
}

const LanguageSelector = ({
  displayType = "inline",
  showFlags = true,
  showNativeNames = true,
}: LanguageSelectorProps) => {
  const { changeLanguage, currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = React.useState(false);
  const handleLanguageSelect = (code: LanguageCode) => {
    changeLanguage(code);
    if (displayType === "modal") {
      setModalVisible(false);
    }
  };

  const renderLanguageList = () => (
    <FlatList
      data={Object.keys(LANGUAGES) as LanguageCode[]}
      keyExtractor={(item) => item}
      ItemSeparatorComponent={() => <Divider />}
      renderItem={({ item }) => (
        <LanguageItem
          languageCode={item}
          isSelected={currentLanguage === item}
          onSelect={handleLanguageSelect}
        />
      )}
      style={styles.list}
    />
  );

  if (displayType === "modal") {
    return (
      <>
        <Section
          title= {t("setting.language")}
          subtitle={LANGUAGES[currentLanguage].name}
          handleOpenSection={() => setModalVisible(true)}
        />
        {modalVisible && (
          <Portal>
            <View style={[styles.backDrop, StyleSheet.absoluteFill]} />
          </Portal>
        )}
        <Modal
          animationType="slide"
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable
            onPress={() => setModalVisible(false)}
            style={{ flex: 1 }}
          />
          <ThemedView style={[styles.modalContainer]}>
            <ThemedView style={[styles.modalHeader]}>
              <ThemedText style={styles.modalTitle}>
                {t("setting.select_language")}
              </ThemedText>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <ThemedText style={styles.closeButtonText}>✕</ThemedText>
              </TouchableOpacity>
            </ThemedView>
            <Divider />
            {renderLanguageList()}
          </ThemedView>
        </Modal>
      </>
    );
  }

  return (
    <ThemedView>
      <Stack.Screen options={{ headerShown: true }} />
      {renderLanguageList()}
    </ThemedView>
  );
};

export default LanguageSelector;
const styles = StyleSheet.create({
  list: {
    width: "100%",
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  selectedLanguageItem: {
    backgroundColor: "#f0f0f0",
  },
  flag: {
    fontSize: 24,
    marginRight: 15,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "500",
  },
  nativeName: {
    fontSize: 14,
    color: "#666",
  },
  checkmark: {
    fontSize: 20,
    color: "#2196F3",
  },
  currentLanguage: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    // backgroundColor: "#f5f5f5",
  },
  backDrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    justifyContent: "flex-end",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#666",
  },
});
