import ThemedText from "@/components/common/Themed/ThemedText";
import { TemperatureUnit } from "@/types/common/unit";
import { getTemperatureText } from "@/utils/weatherUtils";
import { useTranslation } from "react-i18next";

export const RealFeel: React.FC<{
  feelslike_c: number;
  feelslike_f: number;
  temperatureUnit: TemperatureUnit;
}> = ({ temperatureUnit, feelslike_c, feelslike_f }) => {
  const { t } = useTranslation();
  const feelLikeTemp = getTemperatureText(
    feelslike_c,
    feelslike_f,
    temperatureUnit
  );
  const feelLike =
    t("home.feature.curren_weather.feel_like") + " " + feelLikeTemp;
  return <ThemedText>{feelLike}</ThemedText>;
};
