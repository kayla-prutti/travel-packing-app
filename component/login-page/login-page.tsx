import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { supabase } from "../../src/lib/supabase/native";
import { styles } from "./login-page.styles";

export function LoginPage() {
  const { height, width } = useWindowDimensions();
  const isCompact = height < 820;
  const isNarrow = width < 390;
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    setLoading(true);

    const { error } =
      mode === "sign-in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    Alert.alert(
      mode === "sign-in" ? "Signed in" : "Account created",
      "The next app screen can be added after login."
    );
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
        >
          <View style={[styles.screen, isCompact && styles.screenCompact]}>
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

            <View style={[styles.tripIcons, isCompact && styles.tripIconsCompact]}>
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
              ]}
            >
              Pack smart for every kind of trip.
            </Text>
            <Text style={[styles.subtitle, isCompact && styles.subtitleCompact]}>
              Tailored lists for hiking, city, beach and beyond - with a quick weather check so
              {" nothing's forgotten."}
            </Text>

            <View style={[styles.form, isCompact && styles.formCompact]}>
              <View style={[styles.field, isCompact && styles.fieldCompact]}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  placeholder="alex@trailmail.co"
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
                    placeholder="••••••••"
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

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <Pressable
                disabled={loading}
                onPress={handleSubmit}
                style={({ pressed }) => [
                  styles.primaryButton,
                  isCompact && styles.primaryButtonCompact,
                  pressed && styles.buttonPressed,
                  loading && styles.disabledButton,
                ]}
              >
                {loading ? (
                  <ActivityIndicator color="#3a1a0e" />
                ) : (
                  <Text
                    style={[
                      styles.primaryButtonText,
                      isCompact && styles.primaryButtonTextCompact,
                    ]}
                  >
                    {mode === "sign-in" ? "Sign in" : "Create account"}
                  </Text>
                )}
              </Pressable>
            </View>

            <View style={[styles.dividerRow, isCompact && styles.dividerRowCompact]}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.divider} />
            </View>

            <View style={[styles.socialRow, isCompact && styles.socialRowCompact]}>
              <Pressable
                onPress={() => handleSocialProvider("Apple")}
                style={({ pressed }) => [
                  styles.socialButton,
                  isCompact && styles.socialButtonCompact,
                  pressed && styles.socialPressed,
                ]}
              >
                <Text style={[styles.appleWordmark, isCompact && styles.appleWordmarkCompact]}>
                  APPLE
                </Text>
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
                <MaterialCommunityIcons name="google-translate" size={24} color="#fff8ea" />
                <Text style={[styles.socialText, isCompact && styles.socialTextCompact]}>Google</Text>
              </Pressable>
            </View>

            <Text style={[styles.switchText, isCompact && styles.switchTextCompact]}>
              {mode === "sign-in" ? "New here?" : "Have an account?"}{" "}
              <Text
                onPress={() => {
                  setError(null);
                  setMode(mode === "sign-in" ? "sign-up" : "sign-in");
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
