import React from "react";
import { render } from "@testing-library/react-native";
import ThemedView from "../ThemedView";

// Mock hook useAppTheme
jest.mock("@/hooks/common/useAppTheme", () => ({
  useAppTheme: () => ({
    background: "#ffffff",
  }),
}));

// Mock useSafeAreaInsets
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({
    top: 20,
    bottom: 0,
    left: 0,
    right: 0,
  }),
}));

describe("ThemedView", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(
      <ThemedView testID="themed-view">
        <></>
      </ThemedView>
    );

    expect(getByTestId("themed-view")).toBeTruthy();
  });

  it("applies theme background color", () => {
    const { getByTestId } = render(<ThemedView testID="themed-view" />);
    const view = getByTestId("themed-view");

    expect(view.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: "#ffffff" }),
      ])
    );
  });

  it("applies correct paddingTop with enableInsets", () => {
    const { getByTestId } = render(
      <ThemedView testID="themed-view" enableInsets />
    );
    const view = getByTestId("themed-view");

    const mergedStyle = Array.isArray(view.props.style)
      ? Object.assign({}, ...view.props.style)
      : view.props.style;

    expect(mergedStyle.paddingTop).toBe(20 * 1.5);
    expect(mergedStyle.paddingHorizontal).toBe(16);
  });

  it("overrides paddingTop manually", () => {
    const { getByTestId } = render(
      <ThemedView testID="themed-view" enableInsetsTop paddingTop={10} />
    );
    const view = getByTestId("themed-view");

    const mergedStyle = Array.isArray(view.props.style)
      ? Object.assign({}, ...view.props.style)
      : view.props.style;

    expect(mergedStyle.paddingTop).toBe(10); //
  });

  it("applies flex: 1 when passed", () => {
    const { getByTestId } = render(<ThemedView testID="themed-view" flex />);
    const view = getByTestId("themed-view");

    const mergedStyle = Array.isArray(view.props.style)
      ? Object.assign({}, ...view.props.style)
      : view.props.style;

    expect(mergedStyle.flex).toBe(1);
  });
});
