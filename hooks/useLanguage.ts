import { LANGUAGE_STORAGE_KEY } from "@/constants/Languages";
import { Languages } from "@/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const changeLanguage = async (language: Languages) => {
    try {
      await i18n.changeLanguage(language);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  const getCurrentLanguage = (): Languages => {
    return i18n.language as Languages;
  };

  return {
    changeLanguage,
    getCurrentLanguage,
    currentLanguage: getCurrentLanguage(),
  };
};
