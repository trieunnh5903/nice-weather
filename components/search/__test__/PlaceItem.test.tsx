import { fireEvent, render, screen } from "@testing-library/react-native";
import { PlaceItem } from "../PlaceItem";
import { Place } from "@/types/weather/place";

const mockPlace: Place = {
  place_id: "1",
  name: "Hanoi",
  lat: "21",
  lon: "105",
  adm_area1: "Hanoi",
  adm_area2: "Hoan Kiem",
  country: "Vietnam",
  timezone: "Asia/Ho_Chi_Minh",
  type: "city",
};

it("renders name and address", () => {
  render(<PlaceItem item={mockPlace} onPress={jest.fn()} />);
  expect(screen.getByText("Hanoi")).toBeTruthy();
});

it("calls onPress when pressed", () => {
  const mockPress = jest.fn();
  render(<PlaceItem item={mockPlace} onPress={mockPress} />);
  fireEvent.press(screen.getByRole("button"));
  expect(mockPress).toHaveBeenCalledWith(mockPlace);
});

it("shows loading indicator when loading is true", () => {
  render(<PlaceItem item={mockPlace} onPress={jest.fn()} loading />);
  expect(screen.getByTestId("ActivityIndicator")).toBeTruthy();
});
