import en from "./locales/en-US/translation.json";
import vi from "./locales/vi-VN/translation.json";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export type Languages = keyof typeof resources;

const resources = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  compatibilityJSON: "v3",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
