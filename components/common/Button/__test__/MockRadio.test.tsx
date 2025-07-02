import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ModalRadio from "../ModalRadio";

describe("ModalRadio", () => {
  it("renders theme options", async () => {
    const { getByText } = render(<ModalRadio hideModal={jest.fn()} />);
    await waitFor(() => {
      expect(getByText("Dark")).toBeTruthy();
      expect(getByText("Light")).toBeTruthy();
      expect(getByText("Auto")).toBeTruthy();
    });
  });

  it("calls hideModal when CANCEL is pressed", () => {
    const hideModalMock = jest.fn();
    const { getByText } = render(<ModalRadio hideModal={hideModalMock} />);

    fireEvent.press(getByText("CANCEL"));
    expect(hideModalMock).toHaveBeenCalled();
  });
});
