import { StyleSheet } from "react-native";
import React, { memo } from "react";
import { TextInput } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "@/hooks/common";

interface SearchBarProps {
  query: string;
  onChange: (text: string) => void;
  testID?: string;
}

const SearchBar = ({ query, onChange, testID }: SearchBarProps) => {
  const themeColor = useAppTheme();
  const color = themeColor.text;
  const placeholderColor = themeColor.placeholder;
  const { t } = useTranslation();
  return (
    <TextInput
      testID={testID}
      style={[styles.searchInput, { color }]}
      placeholder={t("search.find_location")}
      cursorColor={color}
      value={query}
      placeholderTextColor={placeholderColor}
      onChangeText={onChange}
    />
  );
};

export default memo(SearchBar);

const styles = StyleSheet.create({
  searchInput: {
    paddingHorizontal: 10,
    flex: 1,
  },
});
