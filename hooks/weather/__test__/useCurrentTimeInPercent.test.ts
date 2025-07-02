import { weatherUtils } from "@/utils";
import { useCurrentTimeInPercent } from "../useCurrentTimeInPercent";

jest.mock("@/utils", () => ({
  weatherUtils: {
    convertToMinute: jest.fn(),
  },
}));

describe("useCurrentTimeInPercent", () => {
  const mockAstronomy = [
    {
      timezone: "Asia/Ho_Chi_Minh",
      sunrise: "05:30",
      sunset: "18:30",
    },
  ];

  it("returns null if astronomy is undefined", () => {
    expect(useCurrentTimeInPercent(undefined)).toBeNull();
  });

  it("returns null if astronomy is empty", () => {
    expect(useCurrentTimeInPercent([])).toBeNull();
  });

  it("returns 0 when current < sunrise", () => {
    (weatherUtils.convertToMinute as jest.Mock).mockImplementation((time) => {
      if (time === "05:30") return 330;
      if (time === "18:30") return 1110;
      return 300; // current time (5:00)
    });
    expect(useCurrentTimeInPercent(mockAstronomy as any)).toBe(0);
  });

  it("returns 1 when current > sunset", () => {
    (weatherUtils.convertToMinute as jest.Mock).mockImplementation((time) => {
      if (time === "05:30") return 330;
      if (time === "18:30") return 1110;
      return 1200; // current time (8:00 PM)
    });
    expect(useCurrentTimeInPercent(mockAstronomy as any)).toBe(1);
  });

  it("returns correct percentage when current is between sunrise and sunset", () => {
    (weatherUtils.convertToMinute as jest.Mock).mockImplementation((time) => {
      if (time === "05:30") return 330;
      if (time === "18:30") return 1110;
      return 720; // current time (12:00 PM)
    });
    expect(useCurrentTimeInPercent(mockAstronomy as any)).toBeCloseTo(0.5);
  });
});
