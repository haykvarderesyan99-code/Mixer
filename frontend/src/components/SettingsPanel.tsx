type SettingsPanelProps = {
  settings: Record<string, boolean>;
  onToggle: (key: string) => void;
};

export default function SettingsPanel({ settings, onToggle }: SettingsPanelProps) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20 backdrop-blur">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Mixer settings</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Tailor your experience</h2>
      </div>

      <div className="mt-6 space-y-4">
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between rounded-3xl border border-slate-700 bg-slate-900/70 px-4 py-4">
            <div>
              <p className="font-semibold text-white">{key}</p>
              <p className="text-sm text-slate-400">{value ? "Enabled" : "Disabled"}</p>
            </div>
            <button type="button" onClick={() => onToggle(key)} className={`h-10 w-16 rounded-full transition ${value ? "bg-indigo-500" : "bg-slate-700"}`}>
              <span className={`block h-8 w-8 rounded-full bg-white transition ${value ? "translate-x-8" : "translate-x-0"}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
