import { motion } from "framer-motion";

type IconButtonProps = {
  label: string;
  icon: string;
  href?: string;
  action?: () => void;
  color?: string;
  className?: string;
};

export default function IconButton({ label, icon, href, action, color = "bg-slate-900/80", className = "" }: IconButtonProps) {
  const content = (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`group flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 transition ${color} ${className}`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-3xl bg-white/10 text-xl text-white shadow-lg shadow-black/20">
        {icon}
      </span>
      <div className="text-left">
        <p className="font-semibold text-white">{label}</p>
        <p className="text-xs text-slate-400 group-hover:text-slate-200">Open in new window</p>
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="block">
        {content}
      </a>
    );
  }

  return <button type="button" onClick={action} className="w-full text-left">{content}</button>;
}
