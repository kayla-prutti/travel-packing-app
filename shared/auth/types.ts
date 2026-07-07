export type AuthInput = {
  email: string;
  password: string;
};

export type AuthResult = {
  error: string | null;
  message: string | null;
  signedIn: boolean;
};

export type SocialAuthProvider = "apple" | "google";
