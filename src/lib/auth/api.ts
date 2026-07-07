import { supabase } from "../supabase/native";

type AuthInput = {
  email: string;
  password: string;
};

type AuthResult = {
  error: string | null;
  message: string | null;
  signedIn: boolean;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function validateAuthInput({ email, password }: AuthInput) {
  if (!email.trim()) {
    return "Email is required.";
  }
  if (!password) {
    return "Password is required.";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters.";
  }
  return null;
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

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error: error?.message ?? null };
}
