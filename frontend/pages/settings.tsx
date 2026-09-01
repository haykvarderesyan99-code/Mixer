import { useEffect, useState } from "react";
import type { SettingsData } from "../src/types";

const SETTINGS_STORAGE_KEY = "mixer-settings-v1";
const defaultSettings: SettingsData = {
  darkMode: true,
  motion: true,
  activityStatus: true,
  communityAlerts: true,
  emailNotifications: true,
  smsNotifications: false,
  profileVisibility: false,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>(() => {
    if (typeof window === "undefined") return defaultSettings;
    try {
      const saved = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });
  const [blockedUsers, setBlockedUsers] = useState(() => {
    const defaults = [
      { id: "maya", name: "Maya Chen", blocked: false },
      { id: "niko", name: "Niko Hale", blocked: false },
    ];
    try {
      const saved = window.localStorage.getItem("mixer-blocked-users-v1");
      return saved ? JSON.parse(saved) as typeof defaults : defaults;
    } catch {
      return defaults;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings]);

  useEffect(() => {
    window.localStorage.setItem("mixer-blocked-users-v1", JSON.stringify(blockedUsers));
  }, [blockedUsers]);

  const toggle = (key: keyof SettingsData) => {
    setSettings((prev: SettingsData) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Account settings</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Secure your Mixer account</h1>
          <p className="mt-3 text-sm text-slate-400">Update profile security, two-factor authentication, and account identity in one place.</p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[24px] border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-sm font-semibold text-white">Change password</p>
            <p className="mt-3 text-sm text-slate-400">Keep your login secure with a strong new password.</p>
            <button type="button" className="mt-4 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white">
              Update password
            </button>
          </div>
          <div className="rounded-[24px] border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-sm font-semibold text-white">Two-factor authentication</p>
            <p className="mt-3 text-sm text-slate-400">Add an extra layer of protection for your account.</p>
            <button type="button" className="mt-4 rounded-full border border-slate-700 px-4 py-3 text-sm text-slate-300">
              Enable 2FA
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Appearance</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Customize the Mixer look</h2>
          <div className="mt-6 space-y-4">
            {[
              { label: "Dark mode", key: "darkMode" },
              { label: "Smooth motion", key: "motion" },
              { label: "Activity status", key: "activityStatus" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between rounded-3xl border border-slate-700 bg-slate-900/80 px-4 py-4">
                <div>
                  <p className="font-semibold text-white">{item.label}</p>
                  <p className="text-sm text-slate-400">Control your interface style.</p>
                </div>
                <button type="button" onClick={() => toggle(item.key as keyof typeof settings)} className={`h-10 w-16 rounded-full transition ${settings[item.key as keyof typeof settings] ? "bg-indigo-500" : "bg-slate-700"}`}>
                  <span className={`block h-8 w-8 rounded-full bg-white transition ${settings[item.key as keyof typeof settings] ? "translate-x-8" : "translate-x-0"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Privacy</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Manage profile visibility</h2>
          <div className="mt-6 space-y-4">
            {[
              { label: "Profile visibility", key: "profileVisibility", description: "Limit who can see your profile." },
              { label: "Message permissions", key: "communityAlerts", description: "Control who can message you." },
            ].map((item) => (
              <div key={item.key} className="rounded-3xl border border-slate-700 bg-slate-900/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{item.label}</p>
                    <p className="text-sm text-slate-400">{item.description}</p>
                  </div>
                  <button type="button" onClick={() => toggle(item.key as keyof typeof settings)} className={`h-10 w-16 rounded-full transition ${settings[item.key as keyof typeof settings] ? "bg-indigo-500" : "bg-slate-700"}`}>
                    <span className={`block h-8 w-8 rounded-full bg-white transition ${settings[item.key as keyof typeof settings] ? "translate-x-8" : "translate-x-0"}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Notifications</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Stay informed with Mixer alerts</h2>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {[
            { label: "Community activity", key: "communityAlerts" },
            { label: "Email notifications", key: "emailNotifications" },
            { label: "SMS updates", key: "smsNotifications" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between rounded-3xl border border-slate-700 bg-slate-900/80 px-4 py-4">
              <div>
                <p className="font-semibold text-white">{item.label}</p>
                <p className="text-sm text-slate-400">Enable alerts for your selected channels.</p>
              </div>
              <button type="button" onClick={() => toggle(item.key as keyof typeof settings)} className={`h-10 w-16 rounded-full transition ${settings[item.key as keyof typeof settings] ? "bg-indigo-500" : "bg-slate-700"}`}>
                <span className={`block h-8 w-8 rounded-full bg-white transition ${settings[item.key as keyof typeof settings] ? "translate-x-8" : "translate-x-0"}`} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Blocked users</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Manage blocked contacts</h2>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {blockedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between rounded-3xl border border-slate-700 bg-slate-900/80 px-4 py-4">
              <div>
                <p className="font-semibold text-white">{user.name}</p>
                <p className="text-sm text-slate-400">{user.blocked ? "Blocked" : "Active"}</p>
              </div>
              <button
                type="button"
                onClick={() => setBlockedUsers((prev) => prev.map((item) => (item.id === user.id ? { ...item, blocked: !item.blocked } : item)))}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${user.blocked ? "bg-emerald-500 text-slate-950" : "bg-rose-500 text-white"}`}
              >
                {user.blocked ? "Unblock" : "Block"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
