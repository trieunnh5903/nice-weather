import React from "react";
import { render } from "@testing-library/react-native";
import ThemedText from "../ThemedText";
import { StyleSheet, TextStyle } from "react-native";

jest.mock("@/hooks/common/useAppTheme", () => ({
  useAppTheme: jest.fn(() => ({
    text: "#333333",
  })),
}));

describe("ThemedText", () => {
  it("renders correctly with default props", () => {
    const { getByText } = render(<ThemedText>Test Text</ThemedText>);
    const textElement = getByText("Test Text");

    expect(textElement).toBeTruthy();
  });

  it("applies custom font size and lineHeight", () => {
    const { getByText } = render(
      <ThemedText fontSize={20} lineHeight={28}>
        Hello
      </ThemedText>
    );

    const text = getByText("Hello");
    const mergedStyle = StyleSheet.flatten(text.props.style) as TextStyle;

    expect(mergedStyle).toMatchObject({
      fontSize: 20,
      lineHeight: 28,
    });
  });

  it("applies default theme color if no color provided", () => {
    const { getByText } = render(<ThemedText>Color test</ThemedText>);
    const text = getByText("Color test");

    expect(text.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: "#333333" })])
    );
  });

  it("applies uppercase transform when `uppercase` is true", () => {
    const { getByText } = render(<ThemedText uppercase>Uppercase</ThemedText>);
    const text = getByText("Uppercase");

    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ textTransform: "uppercase" }),
      ])
    );
  });
});
