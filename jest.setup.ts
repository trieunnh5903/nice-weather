jest.mock("expo-location", () => ({
  ...jest.requireActual("expo-location"),
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }),
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
      language: "en",
    },
  }),
}));

jest.mock("@/api/weatherApi", () => ({
  ...jest.requireActual("@/api/weatherApi"),
  reverseGeocoding: jest.fn(),
}));

jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useStores: () => ({
    weatherStore: {
      temperatureUnit: "metric",
      addPlace: jest.fn(),
    },
  }),
  useWeatherQueries: jest.fn(() => ({
    isSuccess: true,
  })),
  // useLanguage: () => ({
  //   changeLanguage: jest.fn(),
  //   getCurrentLanguage: jest.fn(() => "en"),
  //   currentLanguage: "en",
  // }),
}));

jest.mock("@/utils/navigationUtils", () => ({
  goBackOrReset: jest.fn(),
}));
