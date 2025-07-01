jest.mock("expo-location", () => ({
  ...jest.requireActual("expo-location"),
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

jest.mock("@expo/vector-icons", () => ({
  MaterialIcons: ({ name }: any) => {
    const { Text } = require("react-native");
    return <Text>{name}</Text>;
  },
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

jest.mock("@/hooks/common", () => ({
  ...jest.requireActual("@/hooks/common"),
  useStores: () => ({
    weatherStore: {
      temperatureUnit: "metric",
      addPlace: jest.fn(),
    },
  }),
}));

jest.mock("@/hooks/location", () => ({
  useLocationList: jest.fn(),
}));

jest.mock("@/hooks/weather", () => ({
  ...jest.requireActual("@/hooks/weather"),
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
  goBack: jest.fn(),
  goBackOrReset: jest.fn(),
}));

jest.mock("@/utils", () => ({
  placeUtils: {
    getAddress: jest.fn().mockReturnValue("Mock Address"),
    formatCoordinates: jest.fn().mockReturnValue({ lat: "0", lon: "0" }),
  },
}));
