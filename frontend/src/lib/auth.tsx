import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, supabaseConfigured } from "./supabase";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(supabaseConfigured);

  useEffect(() => {
    if (!supabaseConfigured) return;
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.error("Supabase session restoration failed", error);
      setSession(data.session);
      setLoading(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const value = useMemo(() => ({ session, user: session?.user ?? null, loading, configured: supabaseConfigured, signOut: async () => { await supabase.auth.signOut(); setSession(null); } }), [loading, session]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

