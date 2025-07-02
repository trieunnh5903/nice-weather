import ThemedText from "@/components/common/Themed/ThemedText";
import ThemedView from "@/components/common/Themed/ThemedView";
import { useAppTheme } from "@/hooks/common";
import { useIsFetching } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export const FetchStatus = ({ dataUpdatedAt }: { dataUpdatedAt: number }) => {
  const { t } = useTranslation();
  const isFetching = useIsFetching();
  const themeColor = useAppTheme();
  const date = new Date(dataUpdatedAt).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (isFetching)
    return (
      <ThemedView style={styles.row}>
        <ActivityIndicator size={12} color={themeColor.primary} />
        <ThemedView paddingLeft={6}>
          <ThemedText type="label">
            {t("home.feature.data_status.updating")}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );

  return (
    <ThemedText type="label">
      {t("home.feature.data_status.updated_at") + " " + date}
    </ThemedText>
  );
};
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
