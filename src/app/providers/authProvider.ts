import { authService } from "@/app/services/auth.service";
import type { Credentials } from "@/app/models/auth";

/**
 * Headless auth provider shaped after Refine's AuthBindings contract so the
 * app can be wrapped with Refine core later without touching the UI layer.
 * Refine is never used as a UI library here.
 */
export const authProvider = {
  async login(credentials: Credentials) {
    const session = await authService.signIn(credentials);
    return { success: true, redirectTo: authService.homeFor(session.user) };
  },
  async logout() {
    await authService.signOut();
    return { success: true, redirectTo: "/login" };
  },
  async check() {
    const user = await authService.currentUser();
    return user
      ? { authenticated: true }
      : { authenticated: false, redirectTo: "/login" };
  },
  async getIdentity() {
    return authService.currentUser();
  },
  async getPermissions() {
    const user = await authService.currentUser();
    return user?.roles ?? [];
  },
  async onError(error: unknown) {
    return { error: error as Error };
  },
};
