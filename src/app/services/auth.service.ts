import type { AppUser } from "@/app/models/users";

// Auth surface stub. The real implementation will call into Supabase via
// src/integrations/supabase/* once authentication is enabled.
export const authService = {
  async currentUser(): Promise<AppUser | null> {
    return null;
  },
  async signOut(): Promise<void> {
    /* no-op */
  },
};
