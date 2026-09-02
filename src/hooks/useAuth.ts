import { useCallback, useEffect, useState } from "react";
import { authService } from "@/app/services/auth.service";
import type { AppUser } from "@/app/models/users";

/** Session-aware state for the shell. Auth logic lives in the service layer. */
export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    authService.currentUser().then((u) => {
      if (active) {
        setUser(u);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    setUser(null);
  }, []);

  return { user, loading, isAuthenticated: !!user, signOut };
}
