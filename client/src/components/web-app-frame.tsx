import type { ReactNode } from "react";
import { Platform, StyleSheet, View } from "react-native";

export function WebAppFrame({ children }: { children: ReactNode }) {
  if (Platform.OS !== "web") {
    return <>{children}</>;
  }

  return (
    <View style={styles.backdrop}>
      <View style={styles.frame}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#2a1408",
  },
  frame: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
  },
});
