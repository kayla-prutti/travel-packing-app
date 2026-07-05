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
    alignSelf: "center",
    backgroundColor: "#c9502e",
    maxWidth: 480,
    paddingHorizontal: 32,
    paddingBottom: 26,
    paddingTop: 28,
    width: "100%",
  },
  screenCompact: {
    paddingBottom: 14,
    paddingHorizontal: 26,
    paddingTop: 14,
  },
  screenTiny: {
    paddingHorizontal: 18,
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
    borderRadius: 13,
    height: 44,
    width: 44,
  },
  brand: {
    color: "#fff8ea",
    fontFamily: Platform.select({ ios: "Georgia", default: "serif" }),
    fontSize: 34,
    fontWeight: "700",
  },
  brandCompact: {
    fontSize: 28,
  },
  tripIcons: {
    flexDirection: "row",
    gap: 44,
    marginTop: 54,
  },
  tripIconsCompact: {
    gap: 30,
    marginTop: 16,
  },
  tripIconsTiny: {
    gap: 28,
    marginTop: 30,
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
    fontSize: 40,
    lineHeight: 41,
    marginTop: 12,
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
    fontSize: 20,
    lineHeight: 29,
    marginTop: 22,
  },
  subtitleCompact: {
    fontSize: 15,
    lineHeight: 20,
    marginTop: 10,
  },
  form: {
    gap: 13,
    marginTop: 34,
  },
  formCompact: {
    gap: 8,
    marginTop: 14,
  },
  field: {
    borderColor: "#ef977f",
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 13,
  },
  fieldCompact: {
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 7,
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
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#eba325",
    borderRadius: 24,
    height: 58,
    justifyContent: "center",
    marginTop: 8,
  },
  primaryButtonCompact: {
    height: 46,
    marginTop: 4,
  },
  primaryButtonText: {
    color: "#3a1a0e",
    fontSize: 25,
    fontWeight: "800",
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
    marginTop: 22,
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
    marginTop: 18,
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
    fontWeight: "300",
    letterSpacing: 1,
  },
  appleWordmarkCompact: {
    fontSize: 16,
  },
  socialText: {
    color: "#fff8ea",
    fontSize: 18,
    fontWeight: "700",
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
    fontWeight: "800",
  },
});
