type FeatureTileProps = {
  title: string;
  description: string;
  accent: string;
};

export default function FeatureTile({ title, description, accent }: FeatureTileProps) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-900/70 p-5 shadow-xl">
      <div className={`inline-flex rounded-full bg-gradient-to-r ${accent} px-3 py-1 text-xs font-semibold text-white/90`}>
        {title}
      </div>
      <p className="mt-4 text-sm text-slate-300">{description}</p>
    </div>
  );
}
