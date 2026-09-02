import type { RoleId } from "@/app/models/roles";
import type { AppUser } from "@/app/models/users";

export type AuthStatus = "idle" | "loading" | "error" | "success";

export interface Credentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface Session {
  user: AppUser;
  /** Opaque token issued by the Express backend (never a raw password). */
  token: string;
  expiresAt: string;
}

export interface AuthError {
  message: string;
  field?: "email" | "password";
}

/** Where each role lands after a successful sign-in. */
export const ROLE_HOME: Record<RoleId, string> = {
  "project-manager": "/projects",
  "human-resources": "/hr",
  finance: "/finance",
  architect: "/architect",
  engineer: "/engineer",
  "site-personnel": "/site",
  consultant: "/consultant",
};

export const AUTH_MESSAGES = {
  invalidEmail: "Please enter a valid email address.",
  passwordRequired: "Password is required.",
  failed: "Unable to sign in. Please check your email and password.",
  loading: "Signing in...",
  success: "Signed in. Redirecting to your workspace…",
  resetSent: "Check your email for password reset instructions.",
  security:
    "Your connection is protected and your account credentials are securely handled.",
} as const;
