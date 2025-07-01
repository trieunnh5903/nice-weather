import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import RippleButtonIcon from "../RippleButtonIcon";
import { Text } from "react-native";

jest.mock("@/hooks/common/useAppTheme", () => ({
  useAppTheme: () => ({
    ripple: "blue",
  }),
}));

describe("RippleButtonIcon", () => {
  it("calls onPress when pressed", () => {
    const handlePress = jest.fn();

    const { getByTestId } = render(
      <RippleButtonIcon onPress={handlePress} testID="ripple-button">
        <Text>Click</Text>
      </RippleButtonIcon>
    );

    fireEvent.press(getByTestId("ripple-button"));
    expect(handlePress).toHaveBeenCalled();
  });

  it("does not call onPress when disabled", () => {
    const handlePress = jest.fn();

    const { getByTestId } = render(
      <RippleButtonIcon onPress={handlePress} testID="ripple-button" disabled>
        <Text>Click</Text>
      </RippleButtonIcon>
    );

    fireEvent.press(getByTestId("ripple-button"));
    expect(handlePress).not.toHaveBeenCalled();
  });

  // it("uses default ripple color from theme if none provided", () => {
  //   const { getByRole } = render(
  //     <RippleButtonIcon onPress={() => {}} testID="ripple-button">
  //       <Text>Ripple</Text>
  //     </RippleButtonIcon>
  //   );

  //   const pressable = getByRole("button");
  //   expect(pressable).toHaveProp(
  //     "android_ripple",
  //     expect.objectContaining({
  //       color: "#cccccc",
  //     })
  //   );
  // });

  // it("uses custom ripple color if provided", () => {
  //   const { getByTestId } = render(
  //     <RippleButtonIcon
  //       onPress={() => {}}
  //       rippleColor="red"
  //       testID="ripple-button"
  //     >
  //       <Text>Ripple</Text>
  //     </RippleButtonIcon>
  //   );

  //   const pressable = getByTestId("ripple-button");
  //   // expect(pressable.props.android_ripple.color).toBe("red");
  // });
});
