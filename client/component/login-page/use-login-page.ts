import { useState } from "react";

import {
  createAccountWithEmail,
  signInWithEmail,
  signInWithSocialProvider,
} from "../../src/auth/auth-client";
import type { SocialAuthProvider } from "../../../shared/auth/types";

type AuthMode = "sign-in" | "sign-up";

type UseLoginPageProps = {
  onSignIn: () => void;
};

export function useLoginPage({ onSignIn }: UseLoginPageProps) {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearMessages() {
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  function toggleMode() {
    clearMessages();
    setMode((current) => (current === "sign-in" ? "sign-up" : "sign-in"));
  }

  async function submitEmailAuth() {
    clearMessages();
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

  async function submitSocialAuth(provider: SocialAuthProvider) {
    clearMessages();
    setIsSubmitting(true);

    const result = await signInWithSocialProvider(provider);

    setIsSubmitting(false);

    if (result.error) {
      setErrorMessage(result.error);
      return;
    }

    if (result.signedIn) {
      onSignIn();
      return;
    }

    if (result.message) {
      setSuccessMessage(result.message);
    }
  }

  return {
    clearMessages,
    email,
    errorMessage,
    isSubmitting,
    mode,
    password,
    setEmail,
    setPassword,
    setShowPassword,
    showPassword,
    submitEmailAuth,
    submitSocialAuth,
    successMessage,
    toggleMode,
  };
}
