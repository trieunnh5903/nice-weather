import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { DraggableItem } from "../DraggableItem";
import { Place } from "@/types/weather/place";

describe("DraggableItem", () => {
  const mockPlace: Place = {
    place_id: "1",
    name: "Test Place",
    country: "Vietnam",
    lat: "10",
    lon: "106",
    adm_area1: "HCM",
    adm_area2: "District 1",
    timezone: "Asia/Ho_Chi_Minh",
    type: "city",
  };

  const mockAppTheme = {
    primary: "blue",
    background: "white",
    icon: "black",
  } as any;

  it("renders place name and address", () => {
    const { getByText } = render(
      <DraggableItem
        item={mockPlace}
        isActive={false}
        drag={jest.fn()}
        appTheme={mockAppTheme}
      />
    );

    expect(getByText("Test Place")).toBeTruthy();
    expect(getByText("Mock Address")).toBeTruthy();
  });

  it("calls drag on long press", () => {
    const dragMock = jest.fn();

    const { getByText } = render(
      <DraggableItem
        item={mockPlace}
        isActive={false}
        drag={dragMock}
        appTheme={mockAppTheme}
      />
    );

    fireEvent(getByText("menu"), "onLongPress");
    expect(dragMock).toHaveBeenCalled();
  });
});
