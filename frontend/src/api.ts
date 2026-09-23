import axios from "axios";
import type { SignupForm } from "./types";
import { supabase } from "./lib/supabase";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4002";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * AUTH — Supabase is the single identity provider (Phase 1).
 * The legacy Express/SQLite auth (JWT in localStorage) has been removed.
 */

export type SignupResult = Awaited<ReturnType<typeof supabase.auth.signUp>>;
export type LoginResult = Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>;

export async function handleSignup(data: SignupForm): Promise<SignupResult> {
  return supabase.auth.signUp({
    email: data.email.trim(),
    password: data.password,
    options: {
      data: {
        username: data.username.trim(),
        display_name: `${data.firstname.trim()} ${data.lastname.trim()}`.trim(),
      },
    },
  });
}

export async function handleLogin(credentials: { username: string; password: string }): Promise<LoginResult> {
  return supabase.auth.signInWithPassword({
    email: credentials.username.trim(),
    password: credentials.password,
  });
}

/**
 * CHAT — legacy Express endpoints. Deprecated: they require the removed Express JWT
 * and will be replaced by Supabase Realtime in Phase 2. Kept temporarily so the
 * Express backend stays callable during the migration window.
 */
export const getChats = async () => (await api.get("/chats")).data.chats;
export const getChatMessages = async (chatId: number | string) => (await api.get(`/chats/${chatId}/messages`)).data.messages;
export const sendChatMessage = async (chatId: number | string, text: string) => (await api.post(`/chats/${chatId}/messages`, { text })).data.message;
export const getChatVersion = async (chatId: number | string) => (await api.get(`/chats/${chatId}/version`)).data.version;
export const setChatVersion = async (chatId: number | string, version: string) => (await api.post(`/chats/${chatId}/version`, { version })).data.version;
