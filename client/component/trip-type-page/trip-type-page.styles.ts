import { StyleSheet } from "react-native";

import { displayFontFamily } from "../../src/theme/typography";

export const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#f7ecd9",
    flex: 1,
    minHeight: 0,
  },
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: "#fdf8ee",
    borderRadius: 16,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  progressRow: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  progressSegment: {
    backgroundColor: "#ecdcc0",
    borderRadius: 999,
    flex: 1,
    height: 5,
  },
  progressSegmentActive: {
    backgroundColor: "#c9502e",
  },
  scrollView: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    paddingBottom: 12,
  },
  stepLabel: {
    color: "#d98a3d",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1.2,
    marginTop: 22,
    paddingHorizontal: 20,
    textTransform: "uppercase",
  },
  title: {
    color: "#2d1b12",
    fontFamily: displayFontFamily,
    fontSize: 30,
    fontWeight: "600",
    marginTop: 6,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
    marginTop: 24,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#fdf8ee",
    borderColor: "transparent",
    borderRadius: 22,
    borderWidth: 2,
    padding: 16,
    width: "47%",
  },
  cardSelected: {
    borderColor: "#c9502e",
  },
  checkBadge: {
    alignItems: "center",
    backgroundColor: "#c9502e",
    borderRadius: 999,
    height: 26,
    justifyContent: "center",
    position: "absolute",
    right: 12,
    top: 12,
    width: 26,
  },
  cardIconWrap: {
    alignItems: "center",
    backgroundColor: "#f3ddb9",
    borderRadius: 16,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  cardLabel: {
    color: "#2d1b12",
    fontFamily: displayFontFamily,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 14,
  },
  cardDescription: {
    color: "#a68a6c",
    fontSize: 13,
    marginTop: 2,
  },
  footer: {
    backgroundColor: "#f7ecd9",
    paddingBottom: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  continueButton: {
    alignItems: "center",
    backgroundColor: "#c9502e",
    borderRadius: 24,
    flexDirection: "row",
    gap: 10,
    height: 58,
    justifyContent: "center",
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonPressed: {
    backgroundColor: "#b5452a",
  },
  continueButtonText: {
    color: "#fff8ea",
    fontSize: 18,
    fontWeight: "600",
  },
});
