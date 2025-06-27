import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CurrentLocationButton from "../CurrentLocationButton";
import { goBackOrReset } from "@/utils/navigationUtils";
import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from "expo-location";
import { reverseGeocoding } from "@/api/weatherApi";
import { Place } from "@/types/weather/place";

const queryClient = new QueryClient();
const mockAddPlace = jest.fn();

jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useStores: () => ({
    weatherStore: {
      addPlace: mockAddPlace,
      temperatureUnit: "metric",
    },
  }),
  useWeatherQueries: jest.fn(() => ({
    isSuccess: true,
  })),
}));

describe("CurrentLocationButton", () => {
  beforeEach(() => jest.clearAllMocks());
  it("when user use current location, add place to the store and go back", async () => {
    const mockCoords = { coords: { latitude: 10, longitude: 10 } };

    (requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });
    (getCurrentPositionAsync as jest.Mock).mockReturnValue(mockCoords);

    const mockPlace: Place = {
      place_id: "1",
      name: "Test",
      lat: "10",
      lon: "10",
      country: "VN",
      adm_area1: "",
      adm_area2: "",
      timezone: "",
      type: "",
    };

    (reverseGeocoding as jest.Mock).mockResolvedValue(mockPlace);

    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <CurrentLocationButton />
      </QueryClientProvider>
    );

    fireEvent.press(getByTestId("use_current_location"));

    await waitFor(() => {
      expect(goBackOrReset).toHaveBeenCalled();
      expect(mockAddPlace).toHaveBeenCalledWith(
        expect.objectContaining({
          place_id: mockPlace.place_id,
          isUserLocation: true,
        })
      );
    });
  });

  it("if permission denied, shows alert or toast", async () => {
    (requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "denied",
    });
    const { useWeatherQueries } = jest.requireMock("@/hooks");
    (useWeatherQueries as jest.Mock).mockResolvedValue({ isSuccess: false });
    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <CurrentLocationButton />
      </QueryClientProvider>
    );

    fireEvent.press(getByTestId("use_current_location"));

    await waitFor(() => {
      expect(mockAddPlace).not.toHaveBeenCalled();
      expect(goBackOrReset).not.toHaveBeenCalled();
    });
  });
});
