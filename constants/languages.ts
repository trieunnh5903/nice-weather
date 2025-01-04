export const LANGUAGE_STORAGE_KEY = "user-language";

export const LANGUAGES = {
  en: {
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
  },
  vi: {
    name: "Vietnamese",
    nativeName: "Tiếng Việt",
    flag: "🇻🇳",
  },
  // ja: {
  //   name: "Japanese",
  //   nativeName: "日本語",
  //   flag: "🇯🇵",
  // },
  // ko: {
  //   name: "Korean",
  //   nativeName: "한국어",
  //   flag: "🇰🇷",
  // },
  // zh: {
  //   name: "Chinese",
  //   nativeName: "中文",
  //   flag: "🇨🇳",
  // },
  // th: {
  //   name: "Thai",
  //   nativeName: "ไทย",
  //   flag: "🇹🇭",
  // },
  // id: {
  //   name: "Indonesian",
  //   nativeName: "Bahasa Indonesia",
  //   flag: "🇮🇩",
  // },
} as const;

export type LanguageCode = keyof typeof LANGUAGES;
