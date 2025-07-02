import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import FooterOfDeleteMode from "../FooterOfDeleteMode";

jest.mock("@/hooks/common", () => ({
  useAppTheme: () => ({ primary: "blue", border: "gray" }),
}));

describe("FooterOfDeleteMode", () => {
  it("renders buttons and triggers callbacks", () => {
    const onCancelPress = jest.fn();
    const onDeletePress = jest.fn();

    const { getByText } = render(
      <FooterOfDeleteMode
        onCancelPress={onCancelPress}
        onDeletePress={onDeletePress}
      />
    );

    // Kiểm tra text
    const cancelButton = getByText("all_location.cancel");
    const deleteButton = getByText("all_location.delete");

    expect(cancelButton).toBeTruthy();
    expect(deleteButton).toBeTruthy();

    // Kiểm tra gọi hàm
    fireEvent.press(cancelButton);
    expect(onCancelPress).toHaveBeenCalled();

    fireEvent.press(deleteButton);
    expect(onDeletePress).toHaveBeenCalled();
  });
});
