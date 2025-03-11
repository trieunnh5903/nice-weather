import { PaperTheme } from "@/constants/colors";
import { useTheme } from "react-native-paper";

export type AppTheme = typeof PaperTheme.dark & typeof PaperTheme.light;

export const useAppTheme = () => useTheme<AppTheme>().colors;
