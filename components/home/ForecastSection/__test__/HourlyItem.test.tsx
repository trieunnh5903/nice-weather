import React from "react";
import { render } from "@testing-library/react-native";
import { HourlyItem } from "../HourlyItem";
import { mockHourlyItem } from "../__mocks__/mockHourlyItem";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key === "home.feature.hourly.today") return "Today";
      if (key === "home.feature.hourly.tomorrow") return "Tomorrow";
      return key;
    },
  }),
}));

jest.mock("@/constants/weatherIcon", () => {
  return {
    1: "icon-sunny",
    2: "icon-cloudy",
    7: "icon-cloud-cover",
  };
});

describe("HourlyItem", () => {
  it("shows 'Today' tag if index === 0", () => {
    const { getByText } = render(
      <HourlyItem
        item={mockHourlyItem}
        index={0}
        nextDayIndex={3}
        width={100}
      />
    );
    expect(getByText("Today")).toBeTruthy();
  });

  it("shows 'Tomorrow' tag if index === nextDayIndex", () => {
    const { getByText } = render(
      <HourlyItem
        item={mockHourlyItem}
        index={5}
        nextDayIndex={5}
        width={100}
      />
    );
    expect(getByText("Tomorrow")).toBeTruthy();
  });

  it("shows no tag if not today or tomorrow", () => {
    const { queryByText } = render(
      <HourlyItem
        item={mockHourlyItem}
        index={2}
        nextDayIndex={5}
        width={100}
      />
    );
    expect(queryByText("Today")).toBeNull();
    expect(queryByText("Tomorrow")).toBeNull();
  });

  it("renders time in hour format", () => {
    const { getByText } = render(
      <HourlyItem
        item={mockHourlyItem}
        index={1}
        nextDayIndex={5}
        width={100}
      />
    );

    // 09:00 UTC = 16:00 ICT (VN) → kiểm tra chuỗi như "4 PM"
    const date = new Date(mockHourlyItem.date);
    const expectedTime = date.toLocaleString("en-ES", {
      hour12: true,
      hour: "numeric",
    });

    expect(getByText(expectedTime)).toBeTruthy();
  });

  it("renders cloud cover", () => {
    const { getByText } = render(
      <HourlyItem
        item={mockHourlyItem}
        index={1}
        nextDayIndex={5}
        width={100}
      />
    );
    expect(getByText("42%")).toBeTruthy();
  });
});
