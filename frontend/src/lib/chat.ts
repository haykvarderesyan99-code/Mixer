import { supabase } from "./supabase";
import type { Chat, ChatMember, Message, Profile } from "../types/database";

export type MixerChat = { chat: Chat; member: ChatMember; profile: Profile | null; latest: Message | null };

export async function loadChats(userId: string): Promise<MixerChat[]> {
  const membership = await supabase.from("chat_members").select("chat_id, user_id, joined_at").eq("user_id", userId);
  if (membership.error) throw membership.error;
  const members = membership.data as ChatMember[];
  if (!members.length) return [];
  const ids = members.map((member) => member.chat_id);
  const [chatsResult, allMembersResult, profilesResult, messagesResult] = await Promise.all([
    supabase.from("chats").select("id, created_by, created_at").in("id", ids),
    supabase.from("chat_members").select("chat_id, user_id, joined_at").in("chat_id", ids),
    supabase.from("profiles").select("id, username, display_name, avatar_url, bio, created_at"),
    supabase.from("messages").select("id, chat_id, sender_id, content, created_at, updated_at, deleted_at, reply_to_id, attachment_url, attachment_type").in("chat_id", ids).is("deleted_at", null).order("created_at", { ascending: false }),
  ]);
  if (chatsResult.error || allMembersResult.error || profilesResult.error || messagesResult.error) throw chatsResult.error || allMembersResult.error || profilesResult.error || messagesResult.error;
  const chats = chatsResult.data as Chat[];
  const chatMembers = allMembersResult.data as ChatMember[];
  const profiles = profilesResult.data as Profile[];
  const messages = messagesResult.data as Message[];
  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));
  const latestByChat = new Map<string, Message>();
  messages.forEach((message) => { if (!latestByChat.has(message.chat_id)) latestByChat.set(message.chat_id, message); });
  return members.map((member) => {
    const other = chatMembers.find((candidate) => candidate.chat_id === member.chat_id && candidate.user_id !== userId);
    const chat = chats.find((candidate) => candidate.id === member.chat_id);
    return chat ? { chat, member, profile: other ? profileById.get(other.user_id) ?? null : null, latest: latestByChat.get(chat.id) ?? null } : null;
  }).filter((value): value is MixerChat => Boolean(value));
}

export async function loadMessages(chatId: string, limit = 50, before?: string) {
  let query = supabase.from("messages").select("id, chat_id, sender_id, content, created_at, updated_at, deleted_at, reply_to_id, attachment_url, attachment_type").eq("chat_id", chatId).order("created_at", { ascending: false }).limit(limit);
  if (before) query = query.lt("created_at", before);
  const result = await query;
  if (result.error) throw result.error;
  return (result.data as Message[]).reverse();
}
