import { mockHourlyItem } from "@/components/home/ForecastSection/__mocks__/mockHourlyItem";
import { Hourly } from "@/types/weather/forecast";
import { renderHook } from "@testing-library/react-native";
import { useHourlyData } from "..";

// mock getChartData
jest.mock("@/utils/weatherUtils", () => ({
  getChartData: jest.fn(() => [{ value: 25, label: "12:00" }]),
}));

const mockHourly: Hourly[] = [
  { ...mockHourlyItem, date: new Date().toISOString() },
  { ...mockHourlyItem, date: new Date(Date.now() + 3600 * 1000).toISOString() },
  {
    ...mockHourlyItem,
    date: new Date(Date.now() + 25 * 3600 * 1000).toISOString(),
  },
];

describe("useHourlyData", () => {
  it("should return default values if hourly is empty", () => {
    const { result } = renderHook(() =>
      useHourlyData({ hourly: [], temperatureUnit: "metric" })
    );

    expect(result.current.chartData).toEqual([]);
    expect(result.current.nextDayIndex).toBe(0);
    expect(result.current.currentTimeIndex).toBe(0);
  });

  it("should return chartData, nextDayIndex, and currentTimeIndex", () => {
    const { result } = renderHook(() =>
      useHourlyData({ hourly: mockHourly, temperatureUnit: "metric" })
    );

    expect(result.current.chartData).toEqual([{ value: 25, label: "12:00" }]);
    expect(result.current.nextDayIndex).toBeGreaterThan(0);
    expect(result.current.currentTimeIndex).toBeGreaterThanOrEqual(0);
  });
});
