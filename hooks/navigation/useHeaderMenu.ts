import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { showError } from "@/utils/errorHandler";
import { router } from "expo-router";
import { useNetworkState } from "../common";

export const useHeaderMenu = (closeMenu: () => void) => {
  const { t } = useTranslation();
  const net = useNetworkState();
  const queryClient = useQueryClient();

  const updateData = async () => {
    if (!net?.isInternetReachable) {
      showError(false);
    } else {
      queryClient.invalidateQueries();
    }
    closeMenu();
  };

  return [
    {
      key: "update",
      title: t("home.menu.update"),
      onPress: updateData,
    },
    {
      key: "setting",
      title: t("home.menu.setting"),
      onPress: () => {
        closeMenu();
        router.navigate("/setting");
      },
    },
    {
      key: "premium",
      title: "Premium",
      onPress: () => {
        closeMenu();
        router.navigate("/payment");
      },
    },
  ];
};
