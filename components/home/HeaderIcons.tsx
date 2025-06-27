import { StyleSheet } from "react-native";
import React, { memo, useState } from "react";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import ThemedView from "../common/Themed/ThemedView";
import { useAppTheme, useHeaderMenu } from "@/hooks";
import { Menu } from "react-native-paper";
import { MaterialIconName } from "@/types/common/materialIcon";
import RippleButtonIcon from "../common/Button/RippleButtonIcon";

interface HeaderIconsProps {
  onHeaderPress: (icon: string) => void;
  headerIcons: MaterialIconName[];
}

const HeaderIcons: React.FC<HeaderIconsProps> = ({
  onHeaderPress,
  headerIcons,
}) => {
  const themeColor = useAppTheme();
  const iconColor = themeColor.icon;
  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  const menuItems = useHeaderMenu(closeMenu);

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
      <Menu
        contentStyle={{
          backgroundColor: themeColor.background,
          borderColor: themeColor.border,
          borderWidth: 0.5,
        }}
        anchorPosition="bottom"
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={
          <RippleButtonIcon onPress={openMenu}>
            <MaterialCommunityIcons
              name={"dots-vertical"}
              size={26}
              color={iconColor}
            />
          </RippleButtonIcon>
        }
      >
        {menuItems.map((item) => (
          <Menu.Item key={item.key} onPress={item.onPress} title={item.title} />
        ))}
      </Menu>
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
