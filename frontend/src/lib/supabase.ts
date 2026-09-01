import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = createClient<Database>(
  supabaseUrl || "https://placeholder.supabase.co",
  supabasePublishableKey || "placeholder-publishable-key",
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } },
);
