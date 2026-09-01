import { createContext, useContext } from "react";
import type { Session, User } from "@supabase/supabase-js";

export type AuthContextValue = { session: Session | null; user: User | null; loading: boolean; configured: boolean; signOut: () => Promise<void> };
export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
