import { useEffect, useState } from "react";
import ContactButton from "../src/components/ContactButton";
import ProfileCard from "../src/components/ProfileCard";
import type { ProfileData } from "../src/types";
import { supabase, supabaseConfigured } from "../src/lib/supabase";
import { useAuth } from "../src/lib/auth-context";

const PROFILE_STORAGE_KEY = "mixer-profile-v1";
const defaultProfile: ProfileData = {
  name: "Nova Pulse",
  handle: "@nova",
  bio: "Building premium communities, AI-powered posts, and creative social experiences.",
  status: "Online • creating stories",
  email: "nova@mixer.app",
  phone: "+1 555 0142",
  avatar: null,
};

export default function ProfilePage() {
  const { user, loading, configured } = useAuth();
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(configured);
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData>(() => {
    if (typeof window === "undefined") return defaultProfile;
    try {
      if (!configured) {
        const saved = window.localStorage.getItem(PROFILE_STORAGE_KEY);
        return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
      }
      return defaultProfile;
    } catch {
      return defaultProfile;
    }
  });
  const [glowingFrame, setGlowingFrame] = useState(() => window.localStorage.getItem("mixer-profile-frame") === "true");

  useEffect(() => {
    if (typeof window !== "undefined" && !configured) {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    }
  }, [configured, profile]);

  useEffect(() => {
    if (!supabaseConfigured || loading) return;
    let mounted = true;
    void supabase.auth.getUser().then(async ({ data: authData, error: authError }) => {
      if (mounted) { setProfileLoading(true); setProfileError(""); }
      if (authError || !authData.user) {
        console.error("Supabase auth user lookup failed", { code: authError?.code, message: authError?.message, details: authError && "details" in authError ? authError.details : undefined, hint: authError && "hint" in authError ? authError.hint : undefined });
        if (mounted) { setProfileError("Your session could not be restored. Please sign in again."); setProfileLoading(false); }
        return;
      }
      const authUserId = authData.user.id;
      if (user?.id !== authUserId) {
        if (mounted) { setProfileError("Authentication session changed while loading your profile. Please refresh."); setProfileLoading(false); }
        return;
      }
      const result = await supabase.from("profiles").select("id, username, display_name, avatar_url, bio, created_at").eq("id", authUserId).maybeSingle();
      if (result.error) {
        console.error("Supabase profile query failed", { code: result.error.code, message: result.error.message, details: result.error.details, hint: result.error.hint, userId: authUserId });
        if (mounted) { setProfileError("We could not load your Mixer profile. Please try again."); setProfileLoading(false); }
        return;
      }
      if (!result.data || !mounted) {
        if (mounted) { console.error("Supabase profile row missing", { userId: authUserId }); setProfileError("Your profile row was not found for this account."); setProfileLoading(false); }
        return;
      }
      const data = result.data;
      setAvatarPath(data.avatar_url);
      let avatar = data.avatar_url;
      if (avatar) {
        const signed = await supabase.storage.from("avatars").createSignedUrl(avatar, 3600);
        if (signed.error) console.error("Supabase avatar signed URL failed", { code: signed.error.name, message: signed.error.message, details: signed.error.cause });
        if (signed.data?.signedUrl) avatar = signed.data.signedUrl;
      }
      if (mounted) { setProfile((prev) => ({ ...prev, name: data.display_name ?? prev.name, handle: data.username ? `@${data.username}` : prev.handle, bio: data.bio ?? prev.bio, email: authData.user.email ?? prev.email, avatar })); setProfileLoading(false); }
    });
    return () => { mounted = false; };
  }, [loading, user]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
    if (!allowedTypes.has(file.type)) {
      setProfileError("Use a JPEG, PNG, WEBP, or GIF image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setProfileError("Avatar images must be 5 MB or smaller.");
      return;
    }

    if (supabaseConfigured && user) {
      void (async () => {
        setProfileError("");
        const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${user.id}/avatar-${Date.now()}.${extension}`;
        const upload = await supabase.storage.from("avatars").upload(path, file, { upsert: false, contentType: file.type });
        if (upload.error) {
          console.error("Supabase avatar upload failed", { code: upload.error.name, message: upload.error.message, details: upload.error.cause });
          setProfileError("Avatar upload failed. Check the image and try again.");
          return;
        }
        const signed = await supabase.storage.from("avatars").createSignedUrl(path, 3600);
        if (signed.error || !signed.data?.signedUrl) {
          console.error("Supabase avatar signed URL failed", { code: signed.error?.name, message: signed.error?.message, details: signed.error?.cause });
          setProfileError("Avatar uploaded, but it could not be displayed.");
          return;
        }
        const update = await supabase.from("profiles").update({ avatar_url: path }).eq("id", user.id);
        if (update.error) {
          console.error("Supabase avatar profile update failed", { code: update.error.code, message: update.error.message, details: update.error.details, hint: update.error.hint });
          setProfileError("Avatar profile update failed.");
          return;
        }
        if (avatarPath && avatarPath !== path) {
          const removed = await supabase.storage.from("avatars").remove([avatarPath]);
          if (removed.error) console.error("Supabase old avatar removal failed", { code: removed.error.name, message: removed.error.message, details: removed.error.cause });
        }
        setAvatarPath(path);
        setProfile((prev) => ({ ...prev, avatar: signed.data.signedUrl }));
      })();
      return;
    }
    if (supabaseConfigured) {
      setProfileError("Please sign in before changing your avatar.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_0.95fr]">
        <ProfileCard
          name={profile.name}
          handle={profile.handle}
          bio={profile.bio}
          status={profile.status}
          avatar={profile.avatar ?? undefined}
          onAvatarChange={handleAvatarChange}
          glowingFrame={glowingFrame}
          followers="24.8K"
          following="3.1K"
          posts="128"
          achievements={["AI Creator", "Community Host", "Premium Member"]}
        />

        <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Contact</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Profile connections</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            <ContactButton title="WhatsApp" subtitle="Open chat" icon="📱" href="https://wa.me/1234567890" colorClass="bg-green-600/10 border border-green-500/30" />
            <ContactButton title="Telegram" subtitle="Open channel" icon="✈️" href="https://t.me/mixerapp" colorClass="bg-sky-500/10 border border-sky-400/30" />
            <ContactButton title="Instagram" subtitle="View posts" icon="📸" href="https://instagram.com/mixerapp" colorClass="bg-pink-600/10 border border-pink-500/30" />
            <ContactButton title="Discord" subtitle="Join server" icon="🎮" href="https://discord.com/invite/mixerapp" colorClass="bg-violet-600/10 border border-violet-500/30" />
          </div>

          <div className="mt-6 rounded-[24px] border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Personal details</p>
            <div className="mt-4 space-y-4">
              <div className="rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-300">
                <p className="font-semibold text-white">Email</p>
                <p className="mt-1">{profile.email}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-300">
                <p className="font-semibold text-white">Phone</p>
                <p className="mt-1">{profile.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Profile edit</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Customize your presence</h2>
              {profileLoading ? <p className="mt-2 text-sm text-slate-400">Loading your Supabase profile...</p> : null}
          </div>
          <label className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-slate-300">
            <input type="checkbox" checked={glowingFrame} onChange={(event) => { setGlowingFrame(event.target.checked); window.localStorage.setItem("mixer-profile-frame", String(event.target.checked)); }} className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-indigo-500" />
            Glowing frame
          </label>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <label className="block text-sm text-slate-300">
            Display name
            <input
              value={profile.name}
              onChange={(event) => setProfile((prev: ProfileData) => ({ ...prev, name: event.target.value }))}
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white outline-none"
            />
          </label>
          <label className="block text-sm text-slate-300">
            Username
            <input
              value={profile.handle}
              onChange={(event) => setProfile((prev: ProfileData) => ({ ...prev, handle: event.target.value }))}
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white outline-none"
            />
          </label>
          <label className="block text-sm text-slate-300">
            Status
            <input
              value={profile.status}
              onChange={(event) => setProfile((prev: ProfileData) => ({ ...prev, status: event.target.value }))}
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white outline-none"
            />
          </label>
        </div>

        <label className="mt-4 block text-sm text-slate-300">
          Bio
          <textarea
            value={profile.bio}
            onChange={(event) => setProfile((prev: ProfileData) => ({ ...prev, bio: event.target.value }))}
            className="mt-2 min-h-[120px] w-full rounded-3xl border border-slate-700 bg-slate-900/80 px-4 py-4 text-white outline-none"
          />
        </label>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={() => {
            window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
            if (supabaseConfigured && user) void supabase.from("profiles").update({ display_name: profile.name, username: profile.handle.replace(/^@/, ""), bio: profile.bio }).eq("id", user.id).then(({ error }) => { if (error) setProfileError("Profile could not be saved."); });
          }} className="rounded-3xl bg-gradient-to-r from-indigo-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white">
            Save profile
          </button>
        </div>
        {profileError ? <p role="alert" className="mt-4 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{profileError}</p> : null}
      </div>
    </div>
  );
}
