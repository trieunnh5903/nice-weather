import { fetchForecast } from "@/api/weatherApi";
import { renderHook, waitFor } from "@testing-library/react-native";
import { mockForecast } from "@/__mock__/weather.mock";
import { ReactQueryWrapper } from "@/tests/reactQueryWrapper";
import { useForecast } from "../useForecast";

jest.mock("@/api/weatherApi", () => ({
  fetchForecast: jest.fn(),
}));

describe("useForecast", () => {
  it("should not run query if lat/lon/unit are missing", () => {
    const { result } = renderHook(() => useForecast(), {
      wrapper: ReactQueryWrapper,
    });

    expect(result.current.isPending).toBe(true);
    expect(fetchForecast).not.toHaveBeenCalled();
  });

  it("should call fetchForecast with correct params when enabled", async () => {
    const lat = "10.762622";
    const lon = "106.660172";
    const unit = "metric";

    jest.mocked(fetchForecast).mockResolvedValueOnce(mockForecast);

    const { result } = renderHook(() => useForecast(lat, lon, unit), {
      wrapper: ReactQueryWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(fetchForecast).toHaveBeenCalledWith(lat, lon, unit);
    // expect(result.current.data).toBe(mockForecast);
  });
});
