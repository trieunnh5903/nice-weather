import { StyleSheet } from "react-native";
import React, { memo, useCallback } from "react";
import { MaterialIconName } from "@/type";
import RippleButtonIcon from "../RippleButtonIcon";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { MenuView } from "@react-native-menu/menu";
import ThemedView from "../ThemedView";
import { useAppTheme } from "@/hooks";

interface HeaderIconsProps {
  onHeaderPress: (icon: string) => void;
  headerIcons: MaterialIconName[];
  onMenuAction: (event: string) => void;
}

const HeaderIcons: React.FC<HeaderIconsProps> = ({
  onHeaderPress,
  headerIcons,
  onMenuAction,
}) => {
  const themeColor = useAppTheme();
  const iconColor = themeColor.icon;
  const handleMenuPress = useCallback(
    ({ nativeEvent }: { nativeEvent: { event: string } }) => {
      onMenuAction(nativeEvent.event);
    },
    [onMenuAction]
  );
  return (
    <ThemedView style={styles.header}>
      {headerIcons.map((icon) => (
        <RippleButtonIcon
          onPress={() => onHeaderPress(icon)}
          key={`header-${icon}`}
        >
          <MaterialIcons name={icon} size={26} color={iconColor} />
        </RippleButtonIcon>
      ))}
      <MenuView
        onPressAction={handleMenuPress}
        actions={[
          { id: "update", title: "Update now" },
          { id: "setting", title: "Setting" },
        ]}
        shouldOpenOnLongPress={false}
      >
        <RippleButtonIcon>
          <MaterialCommunityIcons
            name={"dots-vertical"}
            size={26}
            color={iconColor}
          />
        </RippleButtonIcon>
      </MenuView>
    </ThemedView>
  );
};

export default memo(HeaderIcons);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 18,
    paddingHorizontal: 12,
    paddingTop: 12,
    alignItems: "center",
  },
});
