import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { createAccountWithEmail, signInWithEmail } from "../../src/lib/auth/api";
import { styles } from "./login-page.styles";

type LoginPageProps = {
  onSignIn: () => void;
};

export function LoginPage({ onSignIn }: LoginPageProps) {
  const { height, width } = useWindowDimensions();
  const isCompact = height < 900;
  const isNarrow = width < 390;
  const isTiny = width <= 340;
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const result =
      mode === "sign-in"
        ? await signInWithEmail({ email, password })
        : await createAccountWithEmail({ email, password });

    setIsSubmitting(false);

    if (result.error) {
      setErrorMessage(result.error);
      return;
    }

    if (result.signedIn) {
      onSignIn();
      return;
    }

    setSuccessMessage(result.message ?? "Account created. You can sign in now.");
    setMode("sign-in");
  }

  function handleSocialProvider(provider: "Apple" | "Google") {
    Alert.alert(`${provider} sign in`, "Provider setup can be added after the login screen.");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
          <View
            style={[
              styles.screen,
              isCompact && styles.screenCompact,
              isTiny && styles.screenTiny,
            ]}
          >
            <View style={styles.brandRow}>
              <View style={[styles.logoMark, isCompact && styles.logoMarkCompact]}>
                <MaterialCommunityIcons
                  name="bag-suitcase-outline"
                  size={isCompact ? 24 : 28}
                  color="#2d170d"
                />
              </View>
              <Text style={[styles.brand, isCompact && styles.brandCompact]}>Packwise</Text>
            </View>

            <View
              style={[
                styles.tripIcons,
                isCompact && styles.tripIconsCompact,
                isTiny && styles.tripIconsTiny,
              ]}
            >
              <Ionicons name="sunny-outline" size={isCompact ? 21 : 24} color="#ffd98c" />
              <MaterialCommunityIcons
                name="image-filter-hdr"
                size={isCompact ? 21 : 24}
                color="#ffd98c"
              />
              <MaterialCommunityIcons name="beach" size={isCompact ? 21 : 24} color="#ffd98c" />
            </View>

            <Text
              style={[
                styles.title,
                isCompact && styles.titleCompact,
                isNarrow && styles.titleNarrow,
                isTiny && styles.titleTiny,
              ]}
            >
              Pack smart for every kind of trip.
            </Text>
            <Text style={[styles.subtitle, isCompact && styles.subtitleCompact]}>
              Tailored lists for hiking, city, beach and beyond with a quick weather check so
              {" nothing's forgotten."}
            </Text>

            <View style={[styles.form, isCompact && styles.formCompact]}>
              {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
              {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}

              <View style={[styles.field, isCompact && styles.fieldCompact]}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  placeholder="Email"
                  placeholderTextColor="rgba(255,255,255,0.45)"
                  style={[styles.input, isCompact && styles.inputCompact]}
                  value={email}
                />
              </View>

              <View style={[styles.field, styles.passwordField, isCompact && styles.fieldCompact]}>
                <View style={styles.passwordInputWrap}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    autoCapitalize="none"
                    onChangeText={setPassword}
                    placeholder="Password"
                    placeholderTextColor="rgba(255,255,255,0.45)"
                    secureTextEntry={!showPassword}
                    style={[styles.input, isCompact && styles.inputCompact]}
                    value={password}
                  />
                </View>
                <Pressable
                  accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                  hitSlop={12}
                  onPress={() => setShowPassword((value) => !value)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={28}
                    color="#f4b49d"
                  />
                </Pressable>
              </View>

              <Pressable
                disabled={isSubmitting}
                onPress={handleSubmit}
                style={({ pressed }) => [
                  styles.primaryButton,
                  isCompact && styles.primaryButtonCompact,
                  isSubmitting && styles.disabledButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text
                  style={[styles.primaryButtonText, isCompact && styles.primaryButtonTextCompact]}
                >
                  {isSubmitting
                    ? mode === "sign-in"
                      ? "Signing in..."
                      : "Creating..."
                    : mode === "sign-in"
                      ? "Sign in"
                      : "Create account"}
                </Text>
              </Pressable>
            </View>

            <View style={[styles.dividerRow, isCompact && styles.dividerRowCompact]}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.divider} />
            </View>

            <View
              style={[
                styles.socialRow,
                isCompact && styles.socialRowCompact,
                isTiny && styles.socialRowTiny,
              ]}
            >
              <Pressable
                onPress={() => handleSocialProvider("Apple")}
                style={({ pressed }) => [
                  styles.socialButton,
                  isCompact && styles.socialButtonCompact,
                  pressed && styles.socialPressed,
                ]}
              >
                <MaterialCommunityIcons name="apple" size={24} color="#fff8ea" />
                <Text style={[styles.socialText, isCompact && styles.socialTextCompact]}>Apple</Text>
              </Pressable>

              <Pressable
                onPress={() => handleSocialProvider("Google")}
                style={({ pressed }) => [
                  styles.socialButton,
                  isCompact && styles.socialButtonCompact,
                  pressed && styles.socialPressed,
                ]}
              >
                <MaterialCommunityIcons name="google" size={24} color="#fff8ea" />
                <Text style={[styles.socialText, isCompact && styles.socialTextCompact]}>Google</Text>
              </Pressable>
            </View>

            <Text style={[styles.switchText, isCompact && styles.switchTextCompact]}>
              {mode === "sign-in" ? "New here?" : "Have an account?"}{" "}
              <Text
                onPress={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
                onPressIn={() => {
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                style={styles.switchLink}
              >
                {mode === "sign-in" ? "Create account" : "Sign in"}
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
