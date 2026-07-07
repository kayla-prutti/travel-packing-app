import { Platform } from "react-native";

export const appFontFamily =
  Platform.select({
    ios: "Helvetica Neue",
    android: "sans-serif",
    default: "Helvetica Neue, Helvetica, Arial, sans-serif",
  }) ?? "Helvetica Neue";
