import { act, renderHook, waitFor } from "@testing-library/react-native";
import * as Network from "expo-network";
import { useNetworkState } from "../common";

jest.useFakeTimers();

jest.mock("expo-network", () => ({
  getNetworkStateAsync: jest.fn(),
}));

describe("useNetworkState", () => {
  const mockNetworkState = {
    type: "WIFI",
    isConnected: true,
    isInternetReachable: true,
    details: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return initial null state", async () => {
    (Network.getNetworkStateAsync as jest.Mock).mockResolvedValue(
      mockNetworkState
    );

    const { result } = renderHook(() => useNetworkState());

    await waitFor(() => {
      expect(result.current).toBeNull();
    });
  });

  it("should update state after fetching network info", async () => {
    (Network.getNetworkStateAsync as jest.Mock).mockResolvedValue(
      mockNetworkState
    );

    const { result } = renderHook(() => useNetworkState());

    await waitFor(() => {
      expect(result.current).toEqual(mockNetworkState);
      expect(Network.getNetworkStateAsync).toHaveBeenCalled();
    });
  });

  it("should handle error if getNetworkStateAsync throws", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    (Network.getNetworkStateAsync as jest.Mock).mockRejectedValue(
      new Error("Network error")
    );

    const { result } = renderHook(() => useNetworkState());

    await waitFor(() => {
      expect(result.current).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching network state:",
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });

  it("should poll every 5 seconds", async () => {
    (Network.getNetworkStateAsync as jest.Mock).mockResolvedValue(
      mockNetworkState
    );

    renderHook(() => useNetworkState());

    expect(Network.getNetworkStateAsync).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(5000);
    });
    await waitFor(() => {
      expect(Network.getNetworkStateAsync).toHaveBeenCalledTimes(2);
    });
  });
});
