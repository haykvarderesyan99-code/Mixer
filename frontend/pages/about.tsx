export default function AboutPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-black/20">
        <p className="text-sm uppercase tracking-[0.3em] text-pink-400">About Mixer</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">The future of social media for creators and communities</h1>
        <p className="mt-4 text-base leading-8 text-slate-300">
          Mixer is designed to feel premium, expressive, and fast. It blends polished conversation, AI tools, community creation, and modern content experiences into one unified workspace.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          { title: "Premium identity", text: "Create glowing profiles, unique frames, and professional social presence with powerful customization." },
          { title: "Smart communication", text: "Connect across phone, email, WhatsApp, Telegram, Instagram, and Discord with one click." },
          { title: "AI-powered content", text: "Generate posts, rewrite captions, and create stories with intelligent assistant support." },
        ].map((item) => (
          <div key={item.title} className="rounded-[24px] border border-slate-800 bg-slate-900/80 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{item.title}</p>
            <p className="mt-4 text-sm text-slate-300">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[32px] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-black/20">
        <h2 className="text-2xl font-semibold text-white">Built for creators, powered by AI</h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Mixer gives creators, communities, and teams the tools to launch stories, manage relationships, and grow their social presence with a sleek, AI-enabled workflow.
        </p>
      </section>
    </div>
  );
}
