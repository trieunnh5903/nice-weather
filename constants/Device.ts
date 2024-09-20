import { Dimensions as Dimen } from "react-native";

export const Device = {
  screenWidth: Dimen.get("window").width,
  screenHeight: Dimen.get("window").height,
};
