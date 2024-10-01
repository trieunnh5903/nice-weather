import { Province } from "@/type";

const getAddress = (location: Province) => {
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

const getName = (location: Province) => {
  if (location.local_names?.vi) {
    return location.local_names.vi;
  } else {
    return location.name;
  }
};

const getId = (province: Province) => {
  return `${province.lat}-${province.lon}`;
};

export default { getAddress, getName, getId };
