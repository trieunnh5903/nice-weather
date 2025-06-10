import { useAppTheme } from "@/hooks";
import RippleButtonIcon from "../RippleButtonIcon";
import { AppColors } from "@/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialIconName } from "@/types/common/materialIcon";

interface NavigationButtonProps {
  onPress: () => void;
  icon: MaterialIconName;
}
export const NavigationButton: React.FC<NavigationButtonProps> = ({
  icon,
  onPress,
}) => {
  const themeColor = useAppTheme();
  return (
    <RippleButtonIcon rippleColor={AppColors.dark.ripple} onPress={onPress}>
      <MaterialIcons name={icon} size={32} color={themeColor.icon} />
    </RippleButtonIcon>
  );
};


