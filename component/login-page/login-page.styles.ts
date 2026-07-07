import { StyleSheet } from "react-native";

import { displayFontFamily } from "../../src/theme/typography";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    minHeight: 0,
    backgroundColor: "#c9502e",
  },
  keyboard: {
    flex: 1,
    minHeight: 0,
  },
  scrollView: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    flexGrow: 1,
  },
  screen: {
    alignSelf: "center",
    backgroundColor: "#c9502e",
    flexGrow: 1,
    maxWidth: 480,
    paddingHorizontal: 34,
    paddingBottom: 18,
    paddingTop: 38,
    width: "100%",
  },
  screenCompact: {
    paddingBottom: 16,
    paddingHorizontal: 26,
    paddingTop: 24,
  },
  screenTiny: {
    paddingHorizontal: 18,
  },
  brandRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 18,
  },
  logoMark: {
    alignItems: "center",
    backgroundColor: "#eba325",
    borderRadius: 13,
    height: 50,
    justifyContent: "center",
    width: 50,
  },
  logoMarkCompact: {
    borderRadius: 13,
    height: 44,
    width: 44,
  },
  brand: {
    color: "#fff8ea",
    fontFamily: displayFontFamily,
    fontSize: 30,
    fontWeight: "600",
  },
  brandCompact: {
    fontSize: 28,
  },
  tripIcons: {
    flexDirection: "row",
    gap: 38,
    marginTop: 58,
  },
  tripIconsCompact: {
    gap: 30,
    marginTop: 22,
  },
  tripIconsTiny: {
    gap: 28,
    marginTop: 30,
  },
  title: {
    color: "#fff8ea",
    fontFamily: displayFontFamily,
    fontSize: 46,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 50,
    marginTop: 24,
  },
  titleCompact: {
    fontSize: 34,
    lineHeight: 37,
    marginTop: 16,
  },
  titleNarrow: {
    fontSize: 34,
    lineHeight: 35,
  },
  titleTiny: {
    fontSize: 30,
    lineHeight: 32,
  },
  subtitle: {
    color: "#ffd7c7",
    fontSize: 18,
    lineHeight: 26,
    marginTop: 18,
  },
  subtitleCompact: {
    fontSize: 14,
    lineHeight: 19,
    marginTop: 10,
  },
  form: {
    gap: 14,
    marginTop: 34,
  },
  formCompact: {
    gap: 8,
    marginTop: 16,
  },
  field: {
    borderColor: "#ef977f",
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  fieldCompact: {
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 7,
  },
  passwordField: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  passwordInputWrap: {
    flex: 1,
  },
  label: {
    color: "#f3b69f",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 2.4,
    textTransform: "uppercase",
  },
  input: {
    color: "#ffffff",
    fontSize: 22,
    lineHeight: 30,
    marginTop: 4,
    padding: 0,
  },
  inputCompact: {
    fontSize: 18,
    lineHeight: 24,
    marginTop: 1,
  },
  eyeButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  error: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 16,
    color: "#fff8ea",
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  success: {
    backgroundColor: "rgba(235,163,37,0.22)",
    borderRadius: 16,
    color: "#fff8ea",
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#eba325",
    borderRadius: 22,
    height: 58,
    justifyContent: "center",
    marginTop: 26,
  },
  primaryButtonCompact: {
    height: 46,
    marginTop: 14,
  },
  primaryButtonText: {
    color: "#3a1a0e",
    fontSize: 25,
    fontWeight: "600",
  },
  primaryButtonTextCompact: {
    fontSize: 20,
  },
  buttonPressed: {
    backgroundColor: "#f1ad31",
  },
  disabledButton: {
    opacity: 0.7,
  },
  dividerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 18,
    marginTop: 18,
  },
  dividerRowCompact: {
    marginTop: 10,
  },
  divider: {
    backgroundColor: "#df8169",
    flex: 1,
    height: 1,
  },
  dividerText: {
    color: "#efad96",
    fontSize: 16,
  },
  socialRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: 14,
  },
  socialRowCompact: {
    gap: 12,
    marginTop: 8,
  },
  socialRowTiny: {
    gap: 10,
  },
  socialButton: {
    alignItems: "center",
    borderColor: "#ef977f",
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: 10,
    height: 58,
    justifyContent: "center",
  },
  socialButtonCompact: {
    borderRadius: 16,
    gap: 8,
    height: 44,
  },
  socialPressed: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  appleWordmark: {
    color: "#fff8ea",
    fontSize: 22,
    fontWeight: "400",
    letterSpacing: 1,
  },
  appleWordmarkCompact: {
    fontSize: 16,
  },
  socialText: {
    color: "#fff8ea",
    fontSize: 18,
    fontWeight: "600",
  },
  socialTextCompact: {
    fontSize: 14,
  },
  switchText: {
    color: "#efb29d",
    fontSize: 18,
    marginTop: 16,
    textAlign: "center",
  },
  switchTextCompact: {
    fontSize: 13,
    marginTop: 8,
  },
  switchLink: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
