import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

import type { AuthInput, AuthResult, SocialAuthProvider } from "../../../shared/auth/types";
import { normalizeEmail, validateAuthInput } from "../../../shared/auth/validation";
import { supabase } from "../lib/supabase/native";

WebBrowser.maybeCompleteAuthSession();

function getTokenFromRedirect(url: string, key: string) {
  const parsedUrl = new URL(url);
  const hashParams = new URLSearchParams(parsedUrl.hash.replace(/^#/, ""));
  const queryParams = new URLSearchParams(parsedUrl.search);
  return hashParams.get(key) ?? queryParams.get(key);
}

export async function signInWithEmail({ email, password }: AuthInput): Promise<AuthResult> {
  const validationError = validateAuthInput({ email, password });
  if (validationError) {
    return { error: validationError, message: null, signedIn: false };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: normalizeEmail(email),
    password,
  });

  return { error: error?.message ?? null, message: null, signedIn: !error };
}

export async function createAccountWithEmail({ email, password }: AuthInput): Promise<AuthResult> {
  const validationError = validateAuthInput({ email, password });
  if (validationError) {
    return { error: validationError, message: null, signedIn: false };
  }

  const { data, error } = await supabase.auth.signUp({
    email: normalizeEmail(email),
    password,
  });

  return {
    error: error?.message ?? null,
    message: data.session ? null : "Account created. Check your email to confirm before signing in.",
    signedIn: !!data.session,
  };
}

export async function signInWithSocialProvider(provider: SocialAuthProvider): Promise<AuthResult> {
  const redirectTo = Linking.createURL("auth/callback");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    return { error: error.message, message: null, signedIn: false };
  }

  if (!data.url) {
    return { error: "Unable to start social sign in.", message: null, signedIn: false };
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== "success") {
    return { error: null, message: "Sign in was cancelled.", signedIn: false };
  }

  const code = getTokenFromRedirect(result.url, "code");
  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    return { error: exchangeError?.message ?? null, message: null, signedIn: !exchangeError };
  }

  const accessToken = getTokenFromRedirect(result.url, "access_token");
  const refreshToken = getTokenFromRedirect(result.url, "refresh_token");
  if (!accessToken || !refreshToken) {
    return { error: "Sign in did not return a valid session.", message: null, signedIn: false };
  }

  const { error: sessionError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  return { error: sessionError?.message ?? null, message: null, signedIn: !sessionError };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error: error?.message ?? null };
}
