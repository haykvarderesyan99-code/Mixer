import { supabase } from "./supabase";
import type { Profile } from "../types/database";

const PROFILE_COLUMNS = "id, username, display_name, avatar_url, bio, created_at";

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const result = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", userId)
    .maybeSingle();
  if (result.error) throw result.error;
  return (result.data as Profile | null) ?? null;
}

/**
 * Client-side fallback for the DB trigger that auto-creates a profile row on
 * signup. If the migration has not been applied yet (or the row is missing for
 * any other reason), this creates the row on demand. Safe to call repeatedly.
 */
export async function ensureProfile(
  userId: string,
  fallbacks: { username?: string | null; displayName?: string | null } = {},
): Promise<Profile> {
  const existing = await fetchProfile(userId);
  if (existing) return existing;

  const baseUsername = (fallbacks.username ?? `user_${userId.slice(0, 8)}`).trim();
  const inserted = await supabase
    .from("profiles")
    .insert({
      id: userId,
      username: baseUsername,
      display_name: fallbacks.displayName?.trim() || baseUsername,
      avatar_url: null,
      bio: null,
    })
    .select(PROFILE_COLUMNS)
    .single();
  if (inserted.error) throw inserted.error;
  return inserted.data as Profile;
}