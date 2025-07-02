import React from "react";
import { render } from "@testing-library/react-native";
import { DailyItem } from "../DailyItem";
import { weatherUtils } from "@/utils";
import { mockDailyItem } from "../__mocks__/mockDailyItem";

// Mock i18n
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      switch (key) {
        case "home.feature.daily.today":
          return "Today";
        case "home.feature.daily.next_week":
          return "Next week";
        case "unit.%":
          return "%";
        default:
          return key;
      }
    },
  }),
}));

// Mock weatherUtils
jest.mock("@/utils", () => ({
  weatherUtils: {
    getDay: jest.fn(() => "Monday"),
    days: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
  },
}));

describe("DailyItem", () => {
  it("renders Today tag if index === 0", () => {
    const { getByText } = render(
      <DailyItem item={mockDailyItem} index={0} width={100} />
    );

    expect(getByText("Today")).toBeTruthy();
    expect(getByText("Monday")).toBeTruthy();
    expect(getByText("67%")).toBeTruthy();
  });

  it("renders Next week tag if day === second day (days[1]) and index !== 0", () => {
    (weatherUtils.getDay as jest.Mock).mockReturnValue("Monday"); // days[1]
    const { getByText } = render(
      <DailyItem item={mockDailyItem} index={2} width={100} />
    );

    expect(getByText("Next week")).toBeTruthy();
  });

  it("renders empty tag if not today or next week", () => {
    (weatherUtils.getDay as jest.Mock).mockReturnValue("Wednesday");
    const { queryByText } = render(
      <DailyItem item={mockDailyItem} index={3} width={100} />
    );

    expect(queryByText("Today")).toBeNull();
    expect(queryByText("Next week")).toBeNull();
  });
});
