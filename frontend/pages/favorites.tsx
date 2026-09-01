import PostCard from "../src/components/PostCard";
import { useState } from "react";

type PostComment = { id: string; user: string; text: string };

type Post = {
  id: string;
  author: string;
  handle: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: PostComment[];
  saved: boolean;
};

const initialSaved: Post[] = [
  {
    id: "saved-1",
    author: "Echo Labs",
    handle: "@echolabs",
    content: "Mixer makes posting, sharing, and designing stories feel fast, premium, and highly engaging.",
    timestamp: "Yesterday",
    likes: 240,
    comments: [{ id: "sc1", user: "Nova", text: "This is a great layout!" }],
    saved: true,
  },
];

export default function FavoritesPage() {
  const [savedPosts, setSavedPosts] = useState<Post[]>(initialSaved);

  const toggleSave = (id: string) => {
    setSavedPosts((prev) => prev.map((post) => (post.id === id ? { ...post, saved: !post.saved } : post)));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Saved feed</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Your favorite posts</h1>
          <p className="mt-3 text-sm text-slate-400">Keep a curated collection of top stories, community posts, and AI-crafted updates.</p>
        </div>
      </section>

      <div className="space-y-5">
        {savedPosts.map((post) => (
          <PostCard
            key={post.id}
            {...post}
            avatar={undefined}
            onLike={() => null}
            onSave={toggleSave}
            onShare={() => null}
          />
        ))}
      </div>
    </div>
  );
}
