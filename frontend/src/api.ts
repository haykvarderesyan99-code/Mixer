devimport axios from "axios";
import type { SignupForm } from "./types";
import { supabase, supabaseConfigured } from "./lib/supabase";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4002";
const TOKEN_KEY = "social-network-token";

export const api = axios.create({
  baseURL: API_BASE_URL,        
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const saveToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);
export const hasToken = () => Boolean(localStorage.getItem(TOKEN_KEY));

export const handleSignup = async (data: SignupForm) => {
  if (supabaseConfigured) {
    return supabase.auth.signUp({ email: data.email.trim(), password: data.password, options: { data: { username: data.username.trim(), display_name: `${data.firstname.trim()} ${data.lastname.trim()}` } } });
  }
  const payload = {
    firstName: data.firstname.trim(),
    lastName: data.lastname.trim(),
    username: data.username.trim(),
    password: data.password,
  };

  return api.post("/auth/signup", payload);
};

export const handleLogin = async (data: { username: string; password: string }) => {
  if (supabaseConfigured) {
    return supabase.auth.signInWithPassword({ email: data.username.trim(), password: data.password });
  }
  const payload = {
    username: data.username.trim(),
    password: data.password,
  };

  const response = await api.post<{ token: string }>("/auth/signin", payload);
  saveToken(response.data.token);
  return response;
};

export const getCurrentUser = async () => (await api.get("/auth/user")).data.user;

export const getChats = async () => (await api.get("/chats")).data.chats;
export const getChatMessages = async (chatId: number | string) => (await api.get(`/chats/${chatId}/messages`)).data.messages;
export const sendChatMessage = async (chatId: number | string, text: string) => (await api.post(`/chats/${chatId}/messages`, { text })).data.message;
export const getChatVersion = async (chatId: number | string) => (await api.get(`/chats/${chatId}/version`)).data.version;
export const setChatVersion = async (chatId: number | string, version: string) => (await api.post(`/chats/${chatId}/version`, { version })).data.version;
