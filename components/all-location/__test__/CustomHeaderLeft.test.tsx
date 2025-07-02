import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CustomHeaderLeft from "../CustomHeaderLeft"; //
import { goBack } from "@/utils/navigationUtils";

jest.mock("@/hooks/common", () => ({
  useAppTheme: () => ({ primary: "#FF0000" }),
  useStores: () => ({
    weatherStore: {
      places: [{ id: "1" }, { id: "2" }, { id: "3" }],
    },
  }),
}));

describe("CustomHeaderLeft", () => {
  const mockHandleSelectedAll = jest.fn();
  const defaultProps = {
    handleSelectedAll: mockHandleSelectedAll,
    selectedItems: [],
    progress: { value: 0 } as any,
  };

  it("renders title and select all text", () => {
    const { getByText } = render(<CustomHeaderLeft {...defaultProps} />);
    expect(getByText("all_location.location")).toBeTruthy();
    expect(getByText("all_location.selected_all")).toBeTruthy();
  });

  it("shows check-circle when all places selected", () => {
    const { getByText } = render(
      <CustomHeaderLeft {...defaultProps} selectedItems={["1", "2", "3"]} />
    );
    expect(getByText("check-circle")).toBeTruthy();
  });

  it("shows radio-button-unchecked when not all places selected", () => {
    const { getByText } = render(
      <CustomHeaderLeft {...defaultProps} selectedItems={["1"]} />
    );
    expect(getByText("radio-button-unchecked")).toBeTruthy();
  });

  it("calls handleSelectedAll when pressed", () => {
    const { getByText } = render(<CustomHeaderLeft {...defaultProps} />);
    fireEvent.press(getByText("all_location.selected_all"));
    expect(mockHandleSelectedAll).toHaveBeenCalled();
  });

  it("calls goBack when back button is pressed", () => {
    const { getByTestId } = render(<CustomHeaderLeft {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(goBack).toHaveBeenCalled();
  });
});
