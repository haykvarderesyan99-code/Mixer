type CommunityCardProps = {
  title: string;
  description: string;
  members: string;
  activity: string;
  category: string;
};

export default function CommunityCard({ title, description, members, activity, category }: CommunityCardProps) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-xl transition hover:-translate-y-1 hover:border-indigo-500/30">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-pink-400">{category}</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{title}</h3>
        </div>
        <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs text-slate-300">{activity}</span>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-300">{description}</p>
      <div className="mt-5 rounded-3xl bg-slate-950/70 px-4 py-3 text-sm text-slate-300">{members} members active</div>
    </div>
  );
}
