type StatCardProps = {
  label: string;
  value: string;
  accent?: string;
};

export default function StatCard({ label, value, accent = "from-indigo-500 to-fuchsia-500" }: StatCardProps) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-900/70 p-5 shadow-xl">
      <div className={`inline-flex rounded-full bg-gradient-to-r ${accent} px-3 py-1 text-xs font-semibold text-white/90`}>
        {label}
      </div>
      <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}
