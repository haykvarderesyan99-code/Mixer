import { motion } from "framer-motion";

type BrandMarkProps = {
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: "h-11 w-11 text-lg",
  md: "h-14 w-14 text-2xl",
  lg: "h-16 w-16 text-3xl",
};

export default function BrandMark({ size = "md" }: BrandMarkProps) {
  const logoUrl = import.meta.env.VITE_MIXER_LOGO_URL;

  return (
    <motion.div
      initial={{ scale: 0.94, rotate: -4 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`relative flex items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-fuchsia-500 via-indigo-500 to-sky-500 text-white shadow-[0_20px_40px_rgba(99,102,241,0.35)] ${sizeMap[size]}`}
    >
      {logoUrl ? <img src={logoUrl} alt="Mixer logo" className="h-full w-full rounded-[1.4rem] object-cover" /> : <motion.span
        animate={{ y: [0, -3, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="font-black tracking-[0.15em]"
      >M</motion.span>}
      <motion.span
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.9)]"
      />
    </motion.div>
  );
}
