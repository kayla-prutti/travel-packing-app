import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#c9502e",
  },
  keyboard: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  screen: {
    flexGrow: 1,
    backgroundColor: "#c9502e",
    paddingHorizontal: 32,
    paddingBottom: 26,
    paddingTop: 28,
  },
  screenCompact: {
    paddingBottom: 18,
    paddingHorizontal: 26,
    paddingTop: 18,
  },
  brandRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 20,
  },
  logoMark: {
    alignItems: "center",
    backgroundColor: "#eba325",
    borderRadius: 16,
    height: 56,
    justifyContent: "center",
    width: 56,
  },
  logoMarkCompact: {
    borderRadius: 14,
    height: 48,
    width: 48,
  },
  brand: {
    color: "#fff8ea",
    fontFamily: Platform.select({ ios: "Georgia", default: "serif" }),
    fontSize: 34,
    fontWeight: "700",
  },
  brandCompact: {
    fontSize: 30,
  },
  tripIcons: {
    flexDirection: "row",
    gap: 44,
    marginTop: 54,
  },
  tripIconsCompact: {
    gap: 38,
    marginTop: 38,
  },
  title: {
    color: "#fff8ea",
    fontFamily: Platform.select({ ios: "Georgia", default: "serif" }),
    fontSize: 54,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 55,
    marginTop: 26,
  },
  titleCompact: {
    fontSize: 44,
    lineHeight: 45,
    marginTop: 20,
  },
  titleNarrow: {
    fontSize: 40,
    lineHeight: 41,
  },
  subtitle: {
    color: "#ffd7c7",
    fontSize: 20,
    lineHeight: 29,
    marginTop: 22,
  },
  subtitleCompact: {
    fontSize: 17,
    lineHeight: 24,
    marginTop: 16,
  },
  form: {
    gap: 13,
    marginTop: 34,
  },
  formCompact: {
    gap: 10,
    marginTop: 24,
  },
  field: {
    borderColor: "#ef977f",
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 13,
  },
  fieldCompact: {
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 9,
  },
  passwordField: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
  },
  passwordInputWrap: {
    flex: 1,
  },
  label: {
    color: "#f3b69f",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 2.3,
    textTransform: "uppercase",
  },
  input: {
    color: "#ffffff",
    fontSize: 22,
    lineHeight: 30,
    marginTop: 3,
    padding: 0,
  },
  inputCompact: {
    fontSize: 20,
    lineHeight: 28,
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
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#eba325",
    borderRadius: 24,
    height: 58,
    justifyContent: "center",
    marginTop: 8,
  },
  primaryButtonCompact: {
    height: 52,
    marginTop: 5,
  },
  primaryButtonText: {
    color: "#3a1a0e",
    fontSize: 25,
    fontWeight: "800",
  },
  primaryButtonTextCompact: {
    fontSize: 23,
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
    marginTop: 22,
  },
  dividerRowCompact: {
    marginTop: 16,
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
    marginTop: 18,
  },
  socialRowCompact: {
    gap: 14,
    marginTop: 13,
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
    borderRadius: 18,
    gap: 8,
    height: 52,
  },
  socialPressed: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  appleWordmark: {
    color: "#fff8ea",
    fontSize: 22,
    fontWeight: "300",
    letterSpacing: 1,
  },
  appleWordmarkCompact: {
    fontSize: 19,
  },
  socialText: {
    color: "#fff8ea",
    fontSize: 18,
    fontWeight: "700",
  },
  socialTextCompact: {
    fontSize: 16,
  },
  switchText: {
    color: "#efb29d",
    fontSize: 18,
    marginTop: 16,
    textAlign: "center",
  },
  switchTextCompact: {
    fontSize: 16,
    marginTop: 12,
  },
  switchLink: {
    color: "#ffffff",
    fontWeight: "800",
  },
});
