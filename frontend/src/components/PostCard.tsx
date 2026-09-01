import { motion } from "framer-motion";
import { useState } from "react";

type Comment = {
  id: string;
  user: string;
  text: string;
};

type PostCardProps = {
  id: string;
  author: string;
  handle: string;
  avatar?: string;
  content: string;
  media?: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  saved: boolean;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
};

export default function PostCard({
  id,
  author,
  handle,
  avatar,
  content,
  media,
  timestamp,
  likes,
  comments,
  saved,
  onLike,
  onSave,
  onShare,
}: PostCardProps) {
  const [commentOpen, setCommentOpen] = useState(false);
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="rounded-[28px] border border-white/10 bg-slate-900/75 p-5 shadow-2xl shadow-black/20"
    >
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500 to-pink-500">
          {avatar ? <img src={avatar} alt={author} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">{author[0]}</div>}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-base font-semibold text-white">{author}</p>
              <p className="text-sm text-slate-400">{handle} · {timestamp}</p>
            </div>
            <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">AI</span>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-300">{content}</p>
        </div>
      </div>

      {media ? (
        <div className="mt-4 overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/50">
          <img src={media} alt="post media" className="h-[320px] w-full object-cover" />
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => onLike(id)} className="rounded-2xl border border-slate-700 px-3 py-2 transition hover:bg-rose-500/10 hover:text-rose-200">
            ❤️ {likes}
          </button>
          <button type="button" onClick={() => setCommentOpen((prev) => !prev)} className="rounded-2xl border border-slate-700 px-3 py-2 transition hover:bg-sky-500/10 hover:text-sky-200">
            💬 {comments.length}
          </button>
          <button type="button" onClick={() => onShare(id)} className="rounded-2xl border border-slate-700 px-3 py-2 transition hover:bg-emerald-500/10 hover:text-emerald-200">
            🔁 Share
          </button>
        </div>
        <button type="button" onClick={() => onSave(id)} className={`rounded-2xl px-3 py-2 transition ${saved ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "border border-slate-700 text-slate-300 hover:bg-white/5"}`}>
          {saved ? "Saved" : "Save"}
        </button>
      </div>

      {commentOpen ? (
        <div className="mt-5 space-y-3 rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-2xl bg-slate-900/80 p-3">
              <p className="text-sm font-semibold text-white">{comment.user}</p>
              <p className="mt-1 text-sm text-slate-300">{comment.text}</p>
            </div>
          ))}
        </div>
      ) : null}
    </motion.article>
  );
}
