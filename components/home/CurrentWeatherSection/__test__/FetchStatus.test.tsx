import React from "react";
import { render } from "@testing-library/react-native";
import { FetchStatus } from "../FetchStatus";
import { useIsFetching } from "@tanstack/react-query";

// jest.mock("react-native-paper", () => {
//   const actual = jest.requireActual("react-native-paper");
//   const { View, Text } = require("react-native");
//   return {
//     ...actual,
//     ActivityIndicator: (props: any) => (
//       <View accessibilityRole="progressbar" {...props}>
//         <Text>Mocked ActivityIndicator</Text>
//       </View>
//     ),
//   };
// });
// jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
// Mock i18n
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock hook useAppTheme
jest.mock("@/hooks/common", () => ({
  useAppTheme: () => ({
    primary: "#123456",
  }),
}));

// Mock useIsFetching
jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useIsFetching: jest.fn(),
}));

describe("FetchStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading indicator when fetching", async () => {
    (useIsFetching as jest.Mock).mockReturnValue(1);
    const { findByText, findByRole } = render(
      <FetchStatus dataUpdatedAt={Date.now()} />
    );

    expect(findByText("home.feature.data_status.updating")).toBeTruthy();
    expect(findByRole("progressbar")).toBeTruthy();
  });

  it("shows last updated time when not fetching", () => {
    (useIsFetching as jest.Mock).mockReturnValue(0);

    const fixedDate = new Date("2025-06-28T10:30:00Z");
    const dataUpdatedAt = fixedDate.getTime();

    const { getByText } = render(<FetchStatus dataUpdatedAt={dataUpdatedAt} />);

    const timeString = new Date(dataUpdatedAt).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });

    expect(
      getByText(`home.feature.data_status.updated_at ${timeString}`)
    ).toBeTruthy();
  });
});
