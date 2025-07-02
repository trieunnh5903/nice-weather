import { Place } from "@/types/weather/place";

export const getAddress = (place: Place) => {
  const subtitleParts: string[] = [];

  if (place.adm_area1) {
    subtitleParts.push(place.adm_area1);
  }
  if (place.adm_area2) {
    subtitleParts.push(place.adm_area2);
  }
  subtitleParts.push(place.country);

  return subtitleParts.join(", ");
};

export function convertTZ(date: any, tzString: string) {
  return new Date(
    (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
      timeZone: tzString,
    })
  );
}

export function formatCoordinates({
  latitude,
  longitude,
}: {
  latitude: string;
  longitude: string;
}) {
  const latValue = parseFloat(latitude);
  const lonValue = parseFloat(longitude);

  const lat = latitude.trim().endsWith("S")
    ? -Math.abs(latValue)
    : Math.abs(latValue);
  const lon = longitude.trim().endsWith("W")
    ? -Math.abs(lonValue)
    : Math.abs(lonValue);

  return { lat: lat.toString(), lon: lon.toString() };
}

export default { getAddress, convertTZ, formatCoordinates };
