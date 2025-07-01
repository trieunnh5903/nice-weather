import {
  axiosAstronomyInstance,
  axiosMeteoInstance,
  axiosWeatherInstance,
} from "../axiosConfig";
import {
  directGeocoding,
  fetchAstronomy,
  fetchCurrentWeather,
  fetchForecast,
} from "../weatherApi";
import {
  mockCurrentWeatherResponse,
  mockForecast,
} from "../../__mock__/weather.mock";
import { mockPlace } from "../../__mock__/place.mock";

jest.mock("../axiosConfig", () => ({
  axiosAstronomyInstance: {
    get: jest.fn(),
  },
  axiosWeatherInstance: {
    get: jest.fn(),
  },
  axiosMeteoInstance: {
    get: jest.fn(),
  },
}));

describe("Geocoding API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("directGeocoding should return place list", async () => {
    (axiosMeteoInstance.get as jest.Mock).mockResolvedValue({
      data: [mockPlace],
    });

    const result = await directGeocoding("Ha Noi");

    expect(axiosMeteoInstance.get).toHaveBeenCalledWith(
      "/api/v1/free/find_places_prefix",
      expect.objectContaining({
        params: {
          text: "Ha Noi",
        },
      })
    );

    expect(result).toEqual([mockPlace]);
  });

  it("directGeocoding should throw error if failed", async () => {
    (axiosMeteoInstance.get as jest.Mock).mockRejectedValue(
      new Error("API error")
    );

    await expect(directGeocoding("Hue")).rejects.toThrow("API error");
  });
});

describe("fetchAstronomy", () => {
  it("should return astronomy data", async () => {
    const mockResponse = {
      sunrise: "6:00",
      sunset: "18:00",
    };
    (axiosAstronomyInstance.get as jest.Mock).mockResolvedValue({
      data: mockResponse,
    });

    const result = await fetchAstronomy("21.03", "105.85");

    expect(axiosAstronomyInstance.get).toHaveBeenCalledWith("/json", {
      params: {
        lat: "21.03",
        lng: "105.85",
        date_start: "today",
        date_end: "tomorrow",
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it("should throw error when request fails", async () => {
    const error = new Error("Request failed");
    (axiosAstronomyInstance.get as jest.Mock).mockRejectedValue(error);

    await expect(fetchAstronomy("21.03", "105.85")).rejects.toThrow(
      "Request failed"
    );
  });
});

describe("fetchCurrentWeather", () => {
  it("should return current weather data", async () => {
    (axiosWeatherInstance.get as jest.Mock).mockResolvedValue({
      data: mockCurrentWeatherResponse,
    });

    const result = await fetchCurrentWeather("21.03", "105.85", "en");

    expect(axiosWeatherInstance.get).toHaveBeenCalledWith(
      "v1/current.json",
      expect.objectContaining({
        params: expect.objectContaining({
          q: "21.03,105.85",
          aqi: "yes",
          lang: "en",
        }),
      })
    );

    expect(result).toEqual(mockCurrentWeatherResponse);
  });

  it("should throw error when API fails", async () => {
    const error = new Error("API failed");
    (axiosWeatherInstance.get as jest.Mock).mockRejectedValue(error);

    await expect(fetchCurrentWeather("21.03", "105.85", "en")).rejects.toThrow(
      "API failed"
    );
  });
});

describe("fetchForecast", () => {
  it("should return forecast data", async () => {
    (axiosMeteoInstance.get as jest.Mock).mockResolvedValue({
      data: mockForecast,
    });

    const result = await fetchForecast("21.03", "105.85", "metric");

    expect(axiosMeteoInstance.get).toHaveBeenCalledWith(
      "/api/v1/free/point",
      expect.objectContaining({
        params: expect.objectContaining({
          lat: "21.03",
          lon: "105.85",
          sections: "all",
          language: "en",
        }),
      })
    );

    expect(result).toEqual(mockForecast);
  });

  it("should throw error when API fails", async () => {
    const error = new Error("API failed");
    (axiosMeteoInstance.get as jest.Mock).mockRejectedValue(error);

    await expect(fetchForecast("21.03", "105.85", "metric")).rejects.toThrow(
      "API failed"
    );
  });
});
