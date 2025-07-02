import { fetchAstronomy } from "@/api/weatherApi";
import { renderHook, waitFor } from "@testing-library/react-native";
import { useSunriseSunset } from "../useSunriseSunset";
import { ReactQueryWrapper } from "@/tests/reactQueryWrapper";

jest.mock("@/api/weatherApi", () => ({
  fetchAstronomy: jest.fn(),
}));

describe("useSunriseSunset", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not fetch if lat/lon is missing", () => {
    const { result } = renderHook(() => useSunriseSunset(undefined, "100"), {
      wrapper: ReactQueryWrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(fetchAstronomy).not.toHaveBeenCalled();
  });

  it("should fetch astronomy data with correct lat/lon", async () => {
    (fetchAstronomy as jest.Mock).mockResolvedValue({ sunrise: "06:00" });

    const { result } = renderHook(() => useSunriseSunset("10", "100"), {
      wrapper: ReactQueryWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchAstronomy).toHaveBeenCalledWith("10", "100");
    expect(result.current.data).toEqual({ sunrise: "06:00" });
  });

  it("should handle fetch error", async () => {
    (fetchAstronomy as jest.Mock).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useSunriseSunset("10", "100"), {
      wrapper: ReactQueryWrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Network error");
  });
});
