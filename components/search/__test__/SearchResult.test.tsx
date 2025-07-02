import { fireEvent, render, waitFor } from "@testing-library/react-native";
import SearchResults from "../SearchResults";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Place } from "@/types/weather/place";
import { goBackOrReset } from "@/utils/navigationUtils";

describe("SearchResults", () => {
  const mockResults: Place[] = [
    {
      place_id: "1",
      name: "Hanoi",
      lat: "21",
      lon: "105",
      adm_area1: "Hanoi",
      adm_area2: "Hoan Kiem",
      country: "Vietnam",
      timezone: "Asia/Ho_Chi_Minh",
      type: "city",
    },
    {
      place_id: "2",
      name: "Saigon",
      lat: "2",
      lon: "3",
      adm_area1: "Saigon",
      adm_area2: "Saigon",
      country: "Vietnam",
      timezone: "Asia/Ho_Chi_Minh",
      type: "city",
    },
  ];
  let queryClient: QueryClient;
  beforeAll(() => {
    queryClient = new QueryClient();
  });

  afterAll(() => {
    queryClient.cancelQueries();
    queryClient.clear();
  });

  it("renders nothing when results is null", () => {
    const { toJSON } = render(
      <QueryClientProvider client={queryClient}>
        <SearchResults results={null} />
      </QueryClientProvider>
    );

    expect(toJSON()).toBeNull();
  });

  it("renders 'no results' when results is []", () => {
    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <SearchResults results={[]} />
      </QueryClientProvider>
    );

    expect(getByTestId("no_results")).toBeVisible();
  });

  it("renders list of places when results are provided", async () => {
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <SearchResults results={mockResults} />
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(getByText("Hanoi")).toBeTruthy();
    });
  });

  it("calls store and goBackOrReset when place is selected", async () => {
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <SearchResults results={mockResults} />
      </QueryClientProvider>
    );
    fireEvent.press(getByText("Hanoi"));

    await waitFor(() => {
      expect(goBackOrReset).toHaveBeenCalled();
    });
  });
});
