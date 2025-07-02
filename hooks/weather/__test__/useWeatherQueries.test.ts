import { renderHook } from "@testing-library/react-native";
import { useCurrentWeather } from "../useCurrentWeather";
import { useForecast } from "../useForecast";
import { useSunriseSunset } from "../useSunriseSunset";
import { useWeatherQueries } from "../useWeatherQueries";

// Mock hooks
jest.mock("../useCurrentWeather", () => ({
  useCurrentWeather: jest.fn(),
}));
jest.mock("../useForecast", () => ({
  useForecast: jest.fn(),
}));
jest.mock("../useSunriseSunset", () => ({
  useSunriseSunset: jest.fn(),
}));

describe("useWeatherQueries", () => {
  const input = {
    lat: "10",
    lon: "106",
    unit: "metric" as const,
    language: "en" as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return isSuccess true if all queries succeed", () => {
    (useCurrentWeather as jest.Mock).mockReturnValue({
      isSuccess: true,
      isLoading: false,
    });
    (useForecast as jest.Mock).mockReturnValue({
      isSuccess: true,
      isLoading: false,
    });
    (useSunriseSunset as jest.Mock).mockReturnValue({
      isSuccess: true,
      isLoading: false,
    });

    const { result } = renderHook(() => useWeatherQueries(input));

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it("should return isLoading true if any query is loading", () => {
    (useCurrentWeather as jest.Mock).mockReturnValue({
      isSuccess: true,
      isLoading: true,
    });
    (useForecast as jest.Mock).mockReturnValue({
      isSuccess: true,
      isLoading: false,
    });
    (useSunriseSunset as jest.Mock).mockReturnValue({
      isSuccess: true,
      isLoading: false,
    });

    const { result } = renderHook(() => useWeatherQueries(input));

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isLoading).toBe(true);
  });

  it("should pass correct parameters to sub-hooks", () => {
    (useCurrentWeather as jest.Mock).mockReturnValue({
      isSuccess: true,
      isLoading: false,
    });
    (useForecast as jest.Mock).mockReturnValue({
      isSuccess: true,
      isLoading: false,
    });
    (useSunriseSunset as jest.Mock).mockReturnValue({
      isSuccess: true,
      isLoading: false,
    });

    renderHook(() => useWeatherQueries(input));

    expect(useCurrentWeather).toHaveBeenCalledWith("10", "106", "en");
    expect(useForecast).toHaveBeenCalledWith("10", "106", "metric");
    expect(useSunriseSunset).toHaveBeenCalledWith("10", "106");
  });
});
