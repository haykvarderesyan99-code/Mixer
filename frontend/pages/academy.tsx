import CommunityCard from "../src/components/CommunityCard";
import FeatureTile from "../src/components/FeatureTile";
import TutorialCard from "../src/components/TutorialCard";

const tutorials = [
  {
    title: "Build your first community",
    description: "Launch a premium space, invite members, and configure AI-powered creator tools.",
    progress: 82,
    badge: "Beginner",
  },
  {
    title: "AI caption mastery",
    description: "Write professional, friendly, or storytelling captions using smart prompts.",
    progress: 64,
    badge: "Creator",
  },
  {
    title: "Design a polished profile",
    description: "Customize frames, glow effects, and premium presence for your Mixer identity.",
    progress: 48,
    badge: "Intermediate",
  },
];

const features = [
  { title: "AI Guides", description: "Learn how to generate posts, bios, and captions instantly.", accent: "from-indigo-500 to-pink-500" },
  { title: "Community Tips", description: "Drive engagement with events, reels, and interactive stories.", accent: "from-sky-500 to-violet-500" },
  { title: "Profile Craft", description: "Manage your presence with privacy, security, and style settings.", accent: "from-emerald-500 to-cyan-500" },
];

export default function AcademyPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Mixer Academy</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Learn the platform, launch creativity</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">Interactive tutorials, AI guides, and creator strategies to help you master Mixer with confidence.</p>
          </div>
          <button type="button" className="rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-95">
            Start learning
          </button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {tutorials.map((tutorial) => (
            <TutorialCard key={tutorial.title} {...tutorial} />
          ))}
        </div>

        <div className="grid gap-4">
          {features.map((feature) => (
            <FeatureTile key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Community guides</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Live creator spaces</h2>
          </div>
          <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">Trending</span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <CommunityCard
            title="Design Futures"
            description="A premium circle for visual storytellers, product designers, and brand builders."
            members="5.4k"
            activity="Active"
            category="Design"
          />
          <CommunityCard
            title="AI Voice Lab"
            description="Workshop your captions, posts, and creator campaigns with smart assistant prompts."
            members="3.2k"
            activity="Live"
            category="AI"
          />
        </div>
      </section>
    </div>
  );
}
