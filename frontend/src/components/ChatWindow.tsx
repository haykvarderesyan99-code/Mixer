import { motion } from "framer-motion";
import { useState } from "react";
import type { IGif } from "@giphy/js-types";
import GifPicker from "./GifPicker";

type ChatWindowProps = {
  contact: {
    name: string;
    role: string;
    style: string;
    online: boolean;
    typing?: boolean;
    messages: Array<{ id: string; text: string; isMine: boolean; gifUrl?: string; mediaUrl?: string; mediaType?: "image" | "video" }>;
  };
  composer: string;
  onComposerChange: (value: string) => void;
  onSendMessage: () => void;
  onCall?: (mode: "Voice" | "Video" | "Screen") => void;
  onChatAction?: (action: "mute" | "delete" | "block" | "pin" | "mark-read") => void;
  onGifSelect?: (gif: IGif) => void;
  onStyleChange?: (style: "Telegram" | "WhatsApp" | "Discord" | "Custom") => void;
  onAttachment?: (file: File) => void;
};

export default function ChatWindow({ contact, composer, onComposerChange, onSendMessage, onCall, onChatAction, onGifSelect, onStyleChange, onAttachment }: ChatWindowProps) {
  const quickEmojis = ["✨", "🔥", "❤️", "🙌", "🚀"];
  const [gifPickerOpen, setGifPickerOpen] = useState(false);

  return (
    <motion.section initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Live conversation</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{contact.name}</h2>
          <p className="mt-1 text-sm text-slate-400">{contact.role}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["Telegram", "WhatsApp", "Discord", "Custom"] as const).map((style) => (
              <button key={style} type="button" onClick={() => onStyleChange?.(style)} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${contact.style === style ? "bg-pink-500 text-white" : "border border-slate-700 text-slate-400 hover:border-pink-400"}`}>{style}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onCall?.("Voice")} aria-label={`Call ${contact.name}`} className="rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-emerald-400 hover:text-emerald-300">☎</button>
          <button type="button" onClick={() => onCall?.("Video")} aria-label={`Video call ${contact.name}`} className="rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-sky-400 hover:text-sky-300">▣</button>
          <details className="relative">
            <summary className="cursor-pointer list-none rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-300">•••</summary>
            <div className="absolute right-0 z-10 mt-2 w-52 rounded-2xl border border-slate-700 bg-slate-900 p-2 text-sm shadow-xl">
              <button type="button" onClick={() => onChatAction?.("mute")} className="w-full rounded-xl px-3 py-2 text-left text-slate-300 hover:bg-white/10">Mute notifications</button>
              <button type="button" onClick={() => onChatAction?.("pin")} className="w-full rounded-xl px-3 py-2 text-left text-slate-300 hover:bg-white/10">Pin chat</button>
              <button type="button" onClick={() => onChatAction?.("mark-read")} className="w-full rounded-xl px-3 py-2 text-left text-slate-300 hover:bg-white/10">Mark as read</button>
              <button type="button" onClick={() => onChatAction?.("delete")} className="w-full rounded-xl px-3 py-2 text-left text-slate-300 hover:bg-white/10">Delete chat</button>
              <button type="button" onClick={() => onChatAction?.("block")} className="w-full rounded-xl px-3 py-2 text-left text-rose-300 hover:bg-rose-500/10">Block user</button>
            </div>
          </details>
          <div className="rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300">
            {contact.online ? "Online" : "Offline"}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {contact.messages.map((message) => (
          <div key={message.id} className={`flex ${message.isMine ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-[24px] p-4 text-sm shadow-inner ${message.isMine ? "bg-gradient-to-r from-indigo-500/80 to-pink-500/80 text-white" : "bg-slate-900/80 text-slate-300"}`}>
              {message.gifUrl ? <img src={message.gifUrl} alt="GIF message" className="max-h-52 max-w-full rounded-2xl object-cover" /> : message.mediaUrl && message.mediaType === "video" ? <video controls src={message.mediaUrl} className="max-h-52 max-w-full rounded-2xl" /> : message.mediaUrl ? <img src={message.mediaUrl} alt="Shared attachment" className="max-h-52 max-w-full rounded-2xl object-cover" /> : message.text}
            </div>
          </div>
        ))}
        {contact.typing ? (
          <div className="flex justify-start">
            <div className="rounded-[20px] border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                <span>{contact.name} is typing...</span>
              </span>
            </div>
          </div>
        ) : null}
      </div>

      {gifPickerOpen ? (
        <div className="mt-5">
          <GifPicker onSelect={(gif) => { onGifSelect?.(gif); setGifPickerOpen(false); }} />
        </div>
      ) : null}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          value={composer}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSendMessage();
            }
          }}
          onChange={(event) => onComposerChange(event.target.value)}
          placeholder="Type your reply..."
          className="min-h-[56px] flex-1 rounded-[24px] border border-slate-700 bg-slate-900/70 px-4 py-4 text-sm text-white outline-none transition focus:border-indigo-400"
        />
        <div className="flex gap-2">
          <button type="button" onClick={() => setGifPickerOpen((open) => !open)} className={`rounded-[24px] border px-4 text-sm transition ${gifPickerOpen ? "border-pink-400 bg-pink-500/10 text-pink-200" : "border-slate-700 text-slate-300 hover:border-pink-400"}`}>GIF</button>
          <label className="flex cursor-pointer items-center rounded-[24px] border border-slate-700 px-4 text-sm text-slate-300 hover:border-pink-400">
            <input type="file" accept="image/*,video/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) onAttachment?.(file); event.currentTarget.value = ""; }} />
            Upload
          </label>
          <div className="flex items-center gap-1 rounded-[24px] border border-slate-700 px-2">
            {quickEmojis.map((emoji) => <button key={emoji} type="button" onClick={() => onComposerChange(`${composer}${emoji}`)} className="p-2 text-lg transition hover:scale-110">{emoji}</button>)}
          </div>
        </div>
        <button type="button" onClick={onSendMessage} className="rounded-[24px] bg-gradient-to-r from-indigo-500 to-pink-500 px-5 py-4 text-sm font-semibold text-white transition hover:opacity-95">
          Send
        </button>
      </div>
    </motion.section>
  );
}
