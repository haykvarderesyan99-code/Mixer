export type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
};

export type Chat = { id: string; created_by: string; created_at: string };
export type ChatMember = { chat_id: string; user_id: string; joined_at: string };

export type Message = {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  reply_to_id: string | null;
  attachment_url: string | null;
  attachment_type: string | null;
};

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, "created_at"> & { created_at?: string }; Update: Partial<Omit<Profile, "id" | "created_at">>; Relationships: [] };
      chats: { Row: Chat; Insert: Omit<Chat, "id" | "created_at"> & { id?: string; created_at?: string }; Update: Partial<Omit<Chat, "id" | "created_at">>; Relationships: [] };
      chat_members: { Row: ChatMember; Insert: Omit<ChatMember, "joined_at"> & { joined_at?: string }; Update: Partial<Omit<ChatMember, "chat_id" | "user_id">>; Relationships: [] };
      messages: { Row: Message; Insert: { chat_id: string; sender_id: string; content: string; reply_to_id?: string | null; attachment_url?: string | null; attachment_type?: string | null; id?: string; created_at?: string; updated_at?: string; deleted_at?: string | null }; Update: Partial<Omit<Message, "id" | "chat_id" | "sender_id" | "created_at">>; Relationships: [] };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
