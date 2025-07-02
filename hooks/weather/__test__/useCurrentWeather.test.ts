import { fetchCurrentWeather } from "@/api/weatherApi";
import { renderHook, waitFor } from "@testing-library/react-native";
import { mockCurrentWeatherResponse } from "@/__mock__/weather.mock";
import { ReactQueryWrapper } from "@/tests/reactQueryWrapper";
import { useCurrentWeather } from "../useCurrentWeather";

jest.mock("@/api/weatherApi", () => ({
  fetchCurrentWeather: jest.fn(),
}));

describe("useCurrentWeather", () => {
  it("should not run query if lat/lon/language are missing", () => {
    const { result } = renderHook(() => useCurrentWeather("", "", "vi"), {
      wrapper: ReactQueryWrapper,
    });

    expect(result.current.isPending).toBe(true);
    expect(fetchCurrentWeather).not.toHaveBeenCalled();
  });

  it("should call fetchCurrentWeather with correct parameters", async () => {
    const lat = "10.762622";
    const lon = "106.660172";
    const lang = "vi";

    jest
      .mocked(fetchCurrentWeather)
      .mockResolvedValueOnce(mockCurrentWeatherResponse);

    const { result } = renderHook(() => useCurrentWeather(lat, lon, lang), {
      wrapper: ReactQueryWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchCurrentWeather).toHaveBeenCalledWith(lat, lon, lang);
  });
});
