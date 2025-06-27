import { Pressable } from "react-native";
import React from "react";
import ThemedView from "../common/Themed/ThemedView";
import ThemedText from "../common/Themed/ThemedText";
import { Divider } from "react-native-paper";
import { useAppTheme } from "@/hooks";

interface SectionProps {
  title: string;
  subtitle?: string;
  handleOpenSection: () => void;
}

const Section = ({ handleOpenSection, subtitle, title }: SectionProps) => {
  const themeColor = useAppTheme();

  return (
    <Pressable
      onPress={handleOpenSection}
      android_ripple={{ color: themeColor.ripple, foreground: true }}
    >
      <ThemedView padding={16} paddingBottom={0}>
        <ThemedText type="defaultMedium" fontSize={16}>
          {title}
        </ThemedText>
        {subtitle && (
          <ThemedText color={themeColor.subtitleText}>{subtitle}</ThemedText>
        )}
        <ThemedView paddingTop={16}>
          <Divider />
        </ThemedView>
      </ThemedView>
    </Pressable>
  );
};

export default Section;
