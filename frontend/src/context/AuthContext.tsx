"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { RegisteredUser } from "@/lib/auth-store";
import { fetchProfile, logout as doLogout } from "@/lib/auth-store";

interface AuthCtx {
  user: RegisteredUser | null;
  setUser: (u: RegisteredUser | null) => void;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  setUser: () => {},
  loading: true,
  refresh: async () => {},
  logout: async () => {},
});

/**
 * Fetch profile with up to `retries` retries (200ms apart).
 * Needed for SIGNED_IN on new registrations where the profile
 * row might not exist yet.
 */
async function fetchProfileWithRetry(
  userId: string,
  retries = 5,
  delayMs = 200
): Promise<RegisteredUser | null> {
  for (let i = 0; i < retries; i++) {
    const profile = await fetchProfile(userId);
    if (profile) return profile;
    if (i < retries - 1) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<RegisteredUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      const profile = await fetchProfile(data.user.id);
      setUser(profile);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await doLogout();
  }, []);

  useEffect(() => {
    // Initial session load
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session?.user) {
        const profile = await fetchProfile(data.session.user.id);
        setUser(profile);
      }
      setLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Set loading immediately so no broken UI flash during fetch
          setLoading(true);
          // For SIGNED_IN (new registration), retry in case profile row is being created
          const profile =
            event === "SIGNED_IN"
              ? await fetchProfileWithRetry(session.user.id, 5, 200)
              : await fetchProfile(session.user.id);
          setUser(profile);
          setLoading(false);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
