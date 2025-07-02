import { render, fireEvent } from "@testing-library/react-native";
import SearchBar from "../SearchBar";

describe("SearchBar", () => {
  it("renders with correct value and placeholder", () => {
    const { getByTestId } = render(
      <SearchBar query="Hanoi" onChange={() => {}} testID="input" />
    );
    const input = getByTestId("input");
    expect(input.props.value).toBe("Hanoi");
  });

  it("calls onChange when text changes", () => {
    const onChangeMock = jest.fn();
    const { getByTestId } = render(
      <SearchBar query="Hanoi" onChange={onChangeMock} testID="input" />
    );
    const input = getByTestId("input");
    fireEvent.changeText(input, "Saigon");
    expect(onChangeMock).toHaveBeenCalledWith("Saigon");
  });
});
