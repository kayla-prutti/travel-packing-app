import type { AuthInput } from "./types";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function validateAuthInput({ email, password }: AuthInput): string | null {
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
