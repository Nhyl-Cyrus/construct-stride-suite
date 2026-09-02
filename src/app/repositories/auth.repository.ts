import type { Credentials, Session } from "@/app/models/auth";
import type { AppUser } from "@/app/models/users";
import type { RoleId } from "@/app/models/roles";

/**
 * MOCK AUTH REPOSITORY — replace with fetch() calls to the Express API
 * (see src/app/api/auth/dto.ts) once the backend is available.
 * No credentials are persisted; only an opaque demo token is returned.
 */

const DEMO_ROLE_BY_PREFIX: Record<string, RoleId> = {
  pm: "project-manager",
  hr: "human-resources",
  finance: "finance",
  architect: "architect",
  engineer: "engineer",
  site: "site-personnel",
  consultant: "consultant",
};

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function resolveRole(email: string): RoleId {
  const prefix = email.split("@")[0]?.toLowerCase() ?? "";
  return DEMO_ROLE_BY_PREFIX[prefix] ?? "project-manager";
}

export const authRepository = {
  async login(credentials: Credentials): Promise<Session> {
    await delay(900);
    if (credentials.password.length < 6) {
      throw new Error("INVALID_CREDENTIALS");
    }
    const role = resolveRole(credentials.email);
    const user: AppUser = {
      id: `usr-${role}`,
      name: credentials.email.split("@")[0] ?? "User",
      email: credentials.email,
      roles: [role],
    };
    return {
      user,
      token: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    };
  },

  async me(): Promise<AppUser | null> {
    return null;
  },

  async logout(): Promise<void> {
    await delay(200);
  },

  async forgotPassword(_email: string): Promise<void> {
    await delay(800);
  },

  async resetPassword(_password: string): Promise<void> {
    await delay(800);
  },
};
