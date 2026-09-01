import { motion } from "framer-motion";

type NotificationPanelProps = {
  notifications: Array<{ id: string; title: string; message: string; time: string }>;
};

export default function NotificationPanel({ notifications }: NotificationPanelProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Notifications</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Activity center</h2>
        </div>
        <span className="rounded-full bg-slate-900/70 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">Live</span>
      </div>

      <div className="mt-6 space-y-3">
        {notifications.map((notification) => (
          <div key={notification.id} className="rounded-[24px] border border-slate-700 bg-slate-900/80 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-white">{notification.title}</p>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{notification.time}</span>
            </div>
            <p className="mt-2 text-sm text-slate-400">{notification.message}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
