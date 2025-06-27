import { Astronomy } from "@/types/weather/astronomy";
import { weatherUtils } from "@/utils";

export function useCurrentTimeInPercent(astronomy: Astronomy[] | undefined) {
  if (!astronomy || astronomy.length === 0) return null;
  const today = astronomy[0];
  const now = new Date().toLocaleString("en-US", {
    timeZone: today.timezone,
    hour: "2-digit",
    minute: "2-digit",
  });

  const sunrise = weatherUtils.convertToMinute(today.sunrise);
  const sunset = weatherUtils.convertToMinute(today.sunset);
  const current = weatherUtils.convertToMinute(now);

  return Math.max(0, Math.min((current - sunrise) / (sunset - sunrise), 1));
}
