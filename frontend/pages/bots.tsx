import { useState } from "react";

const tools = [
  { title: "Post Generator", description: "Create content for stories, captions, and community updates.", badge: "AI" },
  { title: "Caption Booster", description: "Rewrite your text in a professional, friendly, or creative tone.", badge: "AI" },
  { title: "Bio Creator", description: "Generate a magnetic profile bio for your Mixer identity.", badge: "Brand" },
];

export default function BotsPage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setResult(`AI result: ${prompt.trim()} — refined into a premium Mixer message.`);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-pink-400">AI Lab</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Create with smart assistants</h1>
          <p className="mt-3 text-sm text-slate-400">Pick one of the AI tools and generate polished content for posts, bios, and captions.</p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {tools.map((tool) => (
            <div key={tool.title} className="rounded-[24px] border border-slate-800 bg-slate-900/80 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{tool.badge}</p>
                <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs text-slate-300">AI</span>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-white">{tool.title}</h2>
              <p className="mt-3 text-sm text-slate-400">{tool.description}</p>
              <button type="button" className="mt-5 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white">
                Open tool
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Prompt studio</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Write a quick AI request</h2>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 hover:opacity-95"
          >
            Generate preview
          </button>
        </div>

        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Ask the AI to rewrite a caption, craft a story, or build a marketing headline..."
          className="mt-6 min-h-[140px] w-full rounded-[24px] border border-slate-700 bg-slate-950/80 px-4 py-4 text-sm text-white outline-none"
        />

        {result ? (
          <div className="mt-6 rounded-[24px] border border-slate-700 bg-slate-950/80 p-5 text-sm text-slate-300">
            <p className="font-semibold text-white">AI result</p>
            <p className="mt-3">{result}</p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
