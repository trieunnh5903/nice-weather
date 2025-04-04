import { AppPaperTheme } from "@/constants/colors";
import { useTheme } from "react-native-paper";

export type AppTheme = typeof AppPaperTheme.dark & typeof AppPaperTheme.light;

export const useAppTheme = () => useTheme<AppTheme>().colors;
