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

export default { getAddress };
