import { renderHook, waitFor } from "@testing-library/react-native";
import {
  fetchCurrentWeather,
  fetchForecast,
  fetchAstronomy,
} from "@/api/weatherApi";
import { mockPlace, mockPlace2 } from "@/__mock__/place.mock";
import { useFullWeatherData } from "../useFullWeatherData";
import { ReactQueryWrapper } from "@/tests/reactQueryWrapper";

jest.mock("@/api/weatherApi", () => ({
  fetchCurrentWeather: jest.fn(),
  fetchForecast: jest.fn(),
  fetchAstronomy: jest.fn(),
}));

describe("useFullWeatherData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call all weather APIs for each place", async () => {
    (fetchCurrentWeather as jest.Mock).mockResolvedValue({});
    (fetchForecast as jest.Mock).mockResolvedValue({});
    (fetchAstronomy as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(
      () => useFullWeatherData([mockPlace], "en", "metric"),
      { wrapper: ReactQueryWrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchCurrentWeather).toHaveBeenCalledWith(
      mockPlace.lat,
      mockPlace.lon,
      "en"
    );
    expect(fetchForecast).toHaveBeenCalledWith(
      mockPlace.lat,
      mockPlace.lon,
      "metric"
    );
    expect(fetchAstronomy).toHaveBeenCalledWith(mockPlace.lat, mockPlace.lon);
  });

  it("should set isError if one query fails", async () => {
    (fetchCurrentWeather as jest.Mock).mockResolvedValue({});
    (fetchForecast as jest.Mock).mockRejectedValue(new Error("Forecast error"));
    (fetchAstronomy as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(
      () => useFullWeatherData([mockPlace], "en", "metric"),
      { wrapper: ReactQueryWrapper }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.isSuccess).toBe(false);
  });

  it("should set isLoading while fetching", async () => {
    (fetchCurrentWeather as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
    );
    (fetchForecast as jest.Mock).mockResolvedValue({});
    (fetchAstronomy as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(
      () => useFullWeatherData([mockPlace], "en", "metric"),
      { wrapper: ReactQueryWrapper }
    );
    console.log("Initial loading state:", result.current.isLoading);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("should handle multiple places correctly", async () => {
    const places = [mockPlace, mockPlace2];

    (fetchCurrentWeather as jest.Mock).mockResolvedValue({});
    (fetchForecast as jest.Mock).mockResolvedValue({});
    (fetchAstronomy as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(
      () => useFullWeatherData(places, "vi", "metric"),
      { wrapper: ReactQueryWrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.currentWeatherQueries.length).toBe(2);
    expect(result.current.forecastQueries.length).toBe(2);
    expect(result.current.astronomyQueries.length).toBe(2);
  });
});
