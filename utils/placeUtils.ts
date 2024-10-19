import { Place } from "@/type";

const getAddress = (place: Place) => {
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

function convertTZ(date: any, tzString: string) {
  return new Date(
    (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
      timeZone: tzString,
    })
  );
}

function formatCoordinates(value: string) {
  return value.replace(/[^\d.-]/g, "");
}
export default { getAddress, convertTZ, formatCoordinates };
