import { motion } from "framer-motion";

type TutorialCardProps = {
  title: string;
  description: string;
  progress: number;
  badge: string;
};

export default function TutorialCard({ title, description, progress, badge }: TutorialCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} className="rounded-[28px] border border-white/10 bg-slate-950/80 p-5 shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-pink-400">{badge}</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{title}</h3>
        </div>
        <span className="rounded-full bg-slate-900/70 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">{progress}%</span>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-300">{description}</p>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-900">
        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-pink-500" style={{ width: `${progress}%` }} />
      </div>
    </motion.div>
  );
}
