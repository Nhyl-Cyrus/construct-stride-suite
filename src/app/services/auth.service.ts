import type { AppUser } from "@/app/models/users";
import type { Credentials, Session } from "@/app/models/auth";
import { ROLE_HOME } from "@/app/models/auth";
import { authRepository } from "@/app/repositories/auth.repository";
import { loginSchema } from "@/app/validation/auth.schema";

const STORAGE_KEY = "easyconstruct-session";

function persist(session: Session, remember?: boolean) {
  if (typeof window === "undefined") return;
  const store = remember ? window.localStorage : window.sessionStorage;
  // Only the opaque token and public profile — never the password.
  store.setItem(STORAGE_KEY, JSON.stringify(session));
}

function readStored(): Session | null {
  if (typeof window === "undefined") return null;
  const raw =
    window.localStorage.getItem(STORAGE_KEY) ??
    window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as Session;
    if (new Date(session.expiresAt).getTime() < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export const authService = {
  async signIn(credentials: Credentials): Promise<Session> {
    const parsed = loginSchema.parse(credentials);
    const session = await authRepository.login(parsed);
    persist(session, parsed.remember);
    return session;
  },

  async currentUser(): Promise<AppUser | null> {
    return readStored()?.user ?? (await authRepository.me());
  },

  currentSession(): Session | null {
    return readStored();
  },

  async signOut(): Promise<void> {
    await authRepository.logout();
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  },

  async requestPasswordReset(email: string): Promise<void> {
    return authRepository.forgotPassword(email);
  },

  async resetPassword(password: string): Promise<void> {
    return authRepository.resetPassword(password);
  },

  /** Role-aware landing route, resolved from the session (never user input). */
  homeFor(user: AppUser): string {
    const role = user.roles[0];
    return (role && ROLE_HOME[role]) || "/dashboard";
  },
};
