import { useLanguage, useStores } from "@/hooks/common";
import { renderHook } from "@testing-library/react-native";
import { useCurrentWeather } from "../useCurrentWeather";
import { useSelectedPlaceWeather } from "../useSelectedPlaceWeather";

// Mocks
jest.mock("@/hooks/common", () => ({
  useStores: jest.fn(),
  useLanguage: jest.fn(),
}));

jest.mock("../useCurrentWeather", () => ({
  useCurrentWeather: jest.fn(),
}));

describe("useSelectedPlaceWeather", () => {
  const mockPlace = { lat: 10, lon: 20, name: "HCMC" };

  beforeEach(() => {
    (useStores as jest.Mock).mockReturnValue({
      weatherStore: {
        selectedPlace: mockPlace,
        selectedIndex: 1,
        places: [mockPlace, { lat: 30, lon: 40 }],
      },
    });

    (useLanguage as jest.Mock).mockReturnValue({
      currentLanguage: "en",
    });

    (useCurrentWeather as jest.Mock).mockReturnValue({
      data: { temperature: 30 },
      isSuccess: true,
    });
  });

  it("should return correct weather data and store info", () => {
    const { result } = renderHook(() => useSelectedPlaceWeather());

    expect(result.current.selectedPlace).toEqual(mockPlace);
    expect(result.current.selectedIndex).toBe(1);
    expect(result.current.totalPlace).toBe(2);
    expect(result.current.currentWeather).toEqual({ temperature: 30 });
    expect(result.current.isSuccess).toBe(true);
  });
});
