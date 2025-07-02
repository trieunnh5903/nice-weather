import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LocationList from "..";
import { useLocationList } from "@/hooks/location";
import { goBack } from "@/utils/navigationUtils";

const mockPlaces = [
  { place_id: "1", name: "Place 1" },
  { place_id: "2", name: "Place 2" },
];

describe("LocationList", () => {
  const mockSetSelectedIndex = jest.fn();
  const mockHandleSelectItem = jest.fn();
  const mockGetTemperature = jest
    .fn()
    .mockImplementation((index) => index + 20);

  beforeEach(() => {
    jest.clearAllMocks();

    (useLocationList as jest.Mock).mockReturnValue({
      getTemperature: mockGetTemperature,
      places: mockPlaces,
      setSelectedIndex: mockSetSelectedIndex,
    });
  });

  it("renders list of WeatherItems", async () => {
    const { getByText } = render(
      <LocationList
        multipleDelete={false}
        selectedItems={[]}
        handleSelectItem={mockHandleSelectItem}
        progress={{ value: 0 } as any}
      />
    );
    await waitFor(() => {
      expect(getByText("Place 1")).toBeTruthy();
      expect(getByText("Place 2")).toBeTruthy();
    });
  });

  it("calls handleSelectItem when multipleDelete is true", async () => {
    const { getByText } = render(
      <LocationList
        multipleDelete={true}
        selectedItems={[]}
        handleSelectItem={mockHandleSelectItem}
        progress={{ value: 0 } as any}
      />
    );

    fireEvent.press(getByText("Place 1"));
    expect(mockHandleSelectItem).toHaveBeenCalledWith("1");
    expect(mockSetSelectedIndex).not.toHaveBeenCalled();
    expect(goBack).not.toHaveBeenCalled();
  });

  it("calls setSelectedIndex and goBack when multipleDelete is false", () => {
    const { getByText } = render(
      <LocationList
        multipleDelete={false}
        selectedItems={[]}
        handleSelectItem={mockHandleSelectItem}
        progress={{ value: 0 } as any}
      />
    );

    fireEvent.press(getByText("Place 2"));
    expect(mockSetSelectedIndex).toHaveBeenCalledWith(1);
    expect(goBack).toHaveBeenCalled();
    expect(mockHandleSelectItem).not.toHaveBeenCalled();
  });
});
