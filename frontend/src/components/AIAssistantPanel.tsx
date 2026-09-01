import { motion } from "framer-motion";
import { useMemo, useState } from "react";

type AIAssistantPanelProps = {
  onGenerate: (prompt: string, style: string, model: string) => void;
  history: Array<{ prompt: string; result: string; mode: string }>;
};

const modes = ["Professional", "Creative", "Friendly", "Marketing", "Storytelling", "Funny"];
const aiModels = ["Gemini", "ChatGPT", "Claude"];

export default function AIAssistantPanel({ onGenerate, history }: AIAssistantPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(modes[0]);
  const [model, setModel] = useState(aiModels[0]);

  const placeholder = useMemo(
    () => `Describe your idea, ask for a caption, or ask the AI to rewrite in ${style.toLowerCase()} style.`,
    [style],
  );

  const quickIdeas = ["Launch a premium creator update", "Write a short community invite", "Turn this into a viral caption"]; 

  return (
    <motion.section initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-pink-400">AI Studio</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Write with AI</h2>
        </div>
        <span className="rounded-full bg-slate-900/70 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">Mixer AI</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {quickIdeas.map((idea) => (
          <button key={idea} type="button" onClick={() => setPrompt(idea)} className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-300 transition hover:border-pink-400">
            {idea}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-4">
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder={placeholder}
          className="min-h-[130px] w-full rounded-[24px] border border-slate-700 bg-slate-900/70 px-4 py-4 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
        />

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="grid gap-3 rounded-[24px] border border-white/10 bg-slate-900/80 p-4">
            <div>
              <p className="text-sm text-slate-400">Transform mode</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {modes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setStyle(item)}
                    className={`rounded-full px-3 py-2 text-sm transition ${style === item ? "bg-indigo-500 text-white" : "border border-slate-700 text-slate-300 hover:bg-white/5"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-400">AI model</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {aiModels.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setModel(item)}
                    className={`rounded-full px-3 py-2 text-sm transition ${model === item ? "bg-pink-500 text-white" : "border border-slate-700 text-slate-300 hover:bg-white/5"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (prompt.trim()) onGenerate(prompt.trim(), style, model);
              setPrompt("");
            }}
            className="rounded-[24px] bg-gradient-to-r from-indigo-500 to-pink-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-pink-500/10 transition hover:opacity-95"
          >
            Generate content
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-[28px] border border-slate-700 bg-slate-900/70 p-5">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Recent AI results</p>
        <div className="mt-4 space-y-3">
          {history.length === 0 ? (
            <p className="text-sm text-slate-500">No AI history yet. Create your first prompt.</p>
          ) : (
            history.slice(0, 3).map((item, index) => (
              <div key={`${item.prompt}-${index}`} className="rounded-3xl bg-slate-950/80 p-4">
                <p className="text-sm font-semibold text-white">{item.mode}</p>
                <p className="mt-2 text-sm text-slate-300">{item.result}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.section>
  );
}
