import { Location } from "@/type";

const getAddress = (location: Location) => {
  const subtitleParts: string[] = [];

  if (location.state) {
    subtitleParts.push(location.state);
  } else if (location.local_names?.vi) {
    subtitleParts.push(location.local_names.vi);
  } else {
    subtitleParts.push(location.name);
  }

  subtitleParts.push(location.country);

  return subtitleParts.join(", ");
};

const getName = (location: Location) => {
  if (location.local_names?.vi) {
    return location.local_names.vi;
  } else {
    return location.name;
  }
};

export default { getAddress, getName };
