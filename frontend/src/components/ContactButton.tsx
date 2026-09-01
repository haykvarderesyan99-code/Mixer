import { motion } from "framer-motion";

type ContactButtonProps = {
  title: string;
  subtitle: string;
  icon: string;
  href: string;
  colorClass: string;
};

export default function ContactButton({ title, subtitle, icon, href, colorClass }: ContactButtonProps) {
  return (
    <motion.a
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`group flex items-center gap-4 rounded-[24px] border border-white/10 px-4 py-4 transition ${colorClass}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/10 text-xl text-white shadow-lg shadow-black/20">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-white">{title}</p>
        <p className="text-sm text-slate-300">{subtitle}</p>
      </div>
    </motion.a>
  );
}
