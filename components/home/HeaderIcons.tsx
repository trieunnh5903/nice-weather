import { StyleSheet } from "react-native";
import React, { memo, useState } from "react";
import RippleButtonIcon from "../RippleButtonIcon";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import ThemedView from "../ThemedView";
import { useAppTheme } from "@/hooks";
import { Menu } from "react-native-paper";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { MaterialIconName } from "@/types/common/materialIcon";

interface HeaderIconsProps {
  onHeaderPress: (icon: string) => void;
  headerIcons: MaterialIconName[];
}

const HeaderIcons: React.FC<HeaderIconsProps> = ({
  onHeaderPress,
  headerIcons,
}) => {
  const queryClient = useQueryClient();
  const themeColor = useAppTheme();
  const iconColor = themeColor.icon;
  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  const { t } = useTranslation();

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
        <Menu.Item
          onPress={() => {
            queryClient.invalidateQueries();
            closeMenu();
          }}
          title={t("home.menu.update")}
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            router.navigate("/setting");
          }}
          title={t("home.menu.setting")}
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            router.navigate("/payment");
          }}
          title={"Premium"}
        />
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
