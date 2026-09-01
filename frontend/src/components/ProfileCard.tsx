import { motion } from "framer-motion";
import { useRef, type ChangeEvent } from "react";

type ProfileCardProps = {
  name: string;
  handle: string;
  bio: string;
  status: string;
  avatar?: string;
  followers: string;
  following: string;
  posts: string;
  achievements: string[];
  onAvatarChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  glowingFrame?: boolean;
};

export default function ProfileCard({
  name,
  handle,
  bio,
  status,
  avatar,
  followers,
  following,
  posts,
  achievements,
  onAvatarChange,
  glowingFrame = false,
}: ProfileCardProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleAvatarClick = () => {
    if (onAvatarChange) inputRef.current?.click();
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20 backdrop-blur"
    >
      <div
        className={`relative mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full border bg-gradient-to-br from-indigo-500 via-violet-600 to-pink-500 cursor-pointer ${glowingFrame ? "border-pink-300 shadow-[0_0_55px_rgba(236,72,153,0.7)]" : "border-indigo-400/30 shadow-[0_0_40px_rgba(168,85,247,0.28)]"}`}
        onClick={handleAvatarClick}
        role={onAvatarChange ? "button" : undefined}
        tabIndex={onAvatarChange ? 0 : undefined}
        aria-label={onAvatarChange ? "Change avatar" : undefined}
      >
        <input ref={inputRef} type="file" accept="image/*" onChange={onAvatarChange} className="sr-only" />
        {avatar ? <img src={avatar} alt={name} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-white">{name[0]}</div>}
        <div className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-white/10 backdrop-blur" />
      </div>

      <div className="text-center">
        <p className="text-xl font-semibold text-white">{name}</p>
        <p className="mt-1 text-sm text-slate-400">{handle}</p>
        <p className="mt-4 text-sm leading-6 text-slate-300">{bio}</p>
        <p className="mt-4 rounded-full bg-slate-900/80 px-4 py-2 text-xs uppercase tracking-[0.3em] text-emerald-300">{status}</p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[{ label: "Followers", value: followers }, { label: "Following", value: following }, { label: "Posts", value: posts }].map((item) => (
          <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 text-center">
            <p className="text-2xl font-semibold text-white">{item.value}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Premium frames</p>
        <div className="flex flex-wrap justify-center gap-3">
          {achievements.map((badge) => (
            <span key={badge} className="rounded-full bg-slate-800/80 px-3 py-1 text-xs text-slate-300">{badge}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
