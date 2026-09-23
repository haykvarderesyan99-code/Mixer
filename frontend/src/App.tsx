import { startTransition, useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "./lib/auth-context";
import AIAssistantPanel from "./components/AIAssistantPanel";
import ChatWindow from "./components/ChatWindow";
import ContactButton from "./components/ContactButton";
import CommunityCard from "./components/CommunityCard";
import NotificationPanel from "./components/NotificationPanel";
import PostCard from "./components/PostCard";
import ProfileCard from "./components/ProfileCard";
import TutorialCard from "./components/TutorialCard";
import CallPanel from "./components/CallPanel";
import type { IGif } from "@giphy/js-types";

type ChatStyle = "Telegram" | "WhatsApp" | "Discord" | "Custom";
type CallMode = "Voice" | "Video" | "Screen";
type MediaType = "image" | "video" | "gif";
type CreateMode = "contact" | "group" | "community" | null;
type Contact = {
  id: string;
  name: string;
  role: string;
  style: ChatStyle;
  online: boolean;
  blocked?: boolean;
  version?: string;
  typing?: boolean;
  messages: Array<{ id: string; text: string; isMine: boolean; gifUrl?: string; mediaUrl?: string; mediaType?: "image" | "video" }>;
};

type PostComment = { id: string; user: string; text: string };

type Post = {
  id: string;
  author: string;
  handle: string;
  avatar?: string;
  content: string;
  media?: string;
  mediaType?: MediaType;
  timestamp: string;
  likes: number;
  comments: PostComment[];
  saved: boolean;
};

type AIHistory = { prompt: string; result: string; mode: string };
type Story = { id: string; author: string; text: string; style: ChatStyle };

type WorkspaceState = {
  username: string | null;
  selectedContactId: string;
  contacts: Contact[];
  chatStyle: ChatStyle;
  openChats: string[];
  activeCall: CallMode | null;
  composer: string;
  aiPrompt: string;
  aiDialogs: Array<{ id: string; prompt: string; answer: string }>;
  createMode: CreateMode;
  savedNotice: string;
};

const STORAGE_KEY = "mixer-state-v1";

const starterContacts: Contact[] = [
  {
    id: "maya",
    name: "Maya Chen",
    role: "Design partner",
    style: "Telegram",
    online: true,
    blocked: false,
    version: "Gemini",
    messages: [
      { id: "1", text: "Your new social space is beautiful.", isMine: false },
      { id: "2", text: "I added the AI helpers and saved the workspace.", isMine: true },
    ],
  },
  {
    id: "niko",
    name: "Niko Hale",
    role: "Product lead",
    style: "WhatsApp",
    online: false,
    blocked: false,
    version: "ChatGPT",
    messages: [{ id: "3", text: "Sending a quick recap for the launch.", isMine: false }],
  },
];

const initialPosts: Post[] = [
  {
    id: "post-1",
    author: "Nova Pulse",
    handle: "@nova",
    content: "Launching a premium creative community called Mixer. Share stories, AI captions, and build a new network with magnetic design.",
    avatar: undefined,
    timestamp: "2h ago",
    likes: 128,
    comments: [
      { id: "c1", user: "Ava", text: "Love the AI-powered story flow!" },
      { id: "c2", user: "Lina", text: "The profile glow looks premium." },
    ],
    saved: false,
  },
  {
    id: "post-2",
    author: "Echo Labs",
    handle: "@echolabs",
    content: "Create your first video reel with the AI caption creator and connect on WhatsApp, Telegram, Instagram, or Discord instantly.",
    media: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80",
    timestamp: "5h ago",
    likes: 324,
    comments: [{ id: "c3", user: "Niko", text: "Such a futuristic social vibe!" }],
    saved: true,
  },
];

const initialStories: Story[] = [
  { id: "story-1", author: "Nova Pulse", text: "Building something bright today.", style: "Telegram" },
  { id: "story-2", author: "Maya Chen", text: "Moodboard drop at 5 PM.", style: "WhatsApp" },
  { id: "story-3", author: "Echo Labs", text: "New community, same energy.", style: "Discord" },
];

const initialState = (): WorkspaceState => {
  if (typeof window === "undefined") {
    return {
      username: null,
      selectedContactId: starterContacts[0].id,
      contacts: starterContacts,
      chatStyle: "Telegram",
      openChats: [],
      activeCall: null,
      composer: "",
      aiPrompt: "",
      aiDialogs: [],
      createMode: null,
      savedNotice: "",
    };
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return {
      username: null,
      selectedContactId: starterContacts[0].id,
      contacts: starterContacts,
      chatStyle: "Telegram",
      openChats: [],
      activeCall: null,
      composer: "",
      aiPrompt: "",
      aiDialogs: [],
      createMode: null,
      savedNotice: "",
    };
  }

  try {
    const parsed = JSON.parse(saved) as Partial<WorkspaceState>;
    return {
      username: parsed.username ?? null,
      selectedContactId: parsed.selectedContactId ?? starterContacts[0].id,
      contacts: Array.isArray(parsed.contacts) && parsed.contacts.length ? parsed.contacts : starterContacts,
      chatStyle: parsed.chatStyle ?? "Telegram",
      openChats: Array.isArray(parsed.openChats) ? parsed.openChats : [],
      activeCall: parsed.activeCall ?? null,
      composer: parsed.composer ?? "",
      aiPrompt: parsed.aiPrompt ?? "",
      aiDialogs: Array.isArray(parsed.aiDialogs) ? parsed.aiDialogs : [],
      createMode: parsed.createMode ?? null,
      savedNotice: parsed.savedNotice ?? "",
    };
  } catch {
    return {
      username: null,
      selectedContactId: starterContacts[0].id,
      contacts: starterContacts,
      chatStyle: "Telegram",
      openChats: [],
      activeCall: null,
      composer: "",
      aiPrompt: "",
      aiDialogs: [],
      createMode: null,
      savedNotice: "",
    };
  }
};

export default function App() {
  const { user } = useAuth();
  const [state, setState] = useState<WorkspaceState>(initialState);
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = window.localStorage.getItem("mixer-posts-v1");
      return saved ? JSON.parse(saved) as Post[] : initialPosts;
    } catch {
      return initialPosts;
    }
  });
  const [newPost, setNewPost] = useState("");
  const [newStory, setNewStory] = useState("");
  const [storyStyle, setStoryStyle] = useState<ChatStyle>("Telegram");
  const [stories, setStories] = useState<Story[]>(() => {
    try {
      const saved = window.localStorage.getItem("mixer-stories-v1");
      return saved ? JSON.parse(saved) as Story[] : initialStories;
    } catch {
      return initialStories;
    }
  });
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType | null>(null);
  const [mediaName, setMediaName] = useState("");
  const [draftName, setDraftName] = useState("");
  const [draftRole, setDraftRole] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [aiHistory, setAiHistory] = useState<AIHistory[]>(() => {
    try {
      const saved = window.localStorage.getItem("mixer-ai-history-v1");
      return saved ? JSON.parse(saved) as AIHistory[] : [];
    } catch {
      return [];
    }
  });
  // Phase 1: identity comes from Supabase. The legacy Express user/chat fetch
  // was removed; chat data wiring moves to Supabase Realtime in Phase 2.
  const authDisplayName = (user?.user_metadata?.display_name ?? user?.user_metadata?.username ?? null) as string | null;
  const username = authDisplayName ?? state.username;
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  useEffect(() => {
    window.localStorage.setItem("mixer-posts-v1", JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    window.localStorage.setItem("mixer-ai-history-v1", JSON.stringify(aiHistory));
  }, [aiHistory]);

  useEffect(() => {
    window.localStorage.setItem("mixer-stories-v1", JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    const mode = searchParams.get("create");
    if (mode === "contact" || mode === "group" || mode === "community") {
      startTransition(() => setState((prev) => ({ ...prev, createMode: mode as CreateMode })));
    } else {
      startTransition(() => setState((prev) => ({ ...prev, createMode: null })));
    }
  }, [searchParams]);

  useEffect(() => {
    const handleFocus = () => {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      try {
        const parsed = JSON.parse(saved) as WorkspaceState;
        setState(parsed);
      } catch {
        return;
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const activeContact = useMemo(
    () => state.contacts.find((contact) => contact.id === state.selectedContactId) ?? state.contacts[0],
    [state.contacts, state.selectedContactId],
  );
  const searchQuery = (searchParams.get("q") ?? "").trim().toLowerCase();
  const visibleContacts = searchQuery ? state.contacts.filter((contact) => `${contact.name} ${contact.role}`.toLowerCase().includes(searchQuery)) : state.contacts;
  const visiblePosts = searchQuery ? posts.filter((post) => `${post.author} ${post.handle} ${post.content}`.toLowerCase().includes(searchQuery)) : posts;

  const handleOpenWindow = (id: string) => {
    setState((prev) => ({ ...prev, openChats: prev.openChats.includes(id) ? prev.openChats : [id, ...prev.openChats] }));
  };

  const handleCloseWindow = (id: string) => {
    setState((prev) => ({ ...prev, openChats: prev.openChats.filter((c) => c !== id) }));
  };

  const handleSetVersion = (id: string, version: string) => {
    setState((prev) => ({
      ...prev,
      contacts: prev.contacts.map((contact) => (contact.id === id ? { ...contact, version } : contact)),
      savedNotice: `Updated version for ${id}`,
    }));

    // Persist to backend (best-effort)
    import("./api").then(({ setChatVersion }) => {
      try {
        setChatVersion(id.replace(/^chat-/, ""), version).catch(() => undefined);
      } catch {
        // ignore
      }
    });
  };

  const handleContactSelect = (id: string) => {
    setState((prev) => ({ ...prev, selectedContactId: id, savedNotice: "Switched chat" }));
  };

  const handleToggleBlock = (id: string) => {
    setState((prev) => ({
      ...prev,
      contacts: prev.contacts.map((contact) =>
        contact.id === id ? { ...contact, blocked: !contact.blocked } : contact,
      ),
      savedNotice: prev.contacts.some((contact) => contact.id === id && !contact.blocked)
        ? "User unblocked"
        : "User blocked",
    }));
  };

  const handleCall = (mode: CallMode) => {
    setState((prev) => ({ ...prev, activeCall: mode, savedNotice: `${mode} call ready with ${activeContact?.name ?? "your contact"}` }));
  };

  const handleEndCall = useCallback(() => {
    setState((prev) => ({ ...prev, activeCall: null, savedNotice: "Call ended" }));
  }, []);

  const handleChatAction = (action: "mute" | "delete" | "block" | "pin" | "mark-read") => {
    if (!activeContact) return;
    if (action === "block") {
      handleToggleBlock(activeContact.id);
      return;
    }
    if (action === "delete") {
      setState((prev) => {
        const contacts = prev.contacts.filter((contact) => contact.id !== activeContact.id);
        return { ...prev, contacts: contacts.length ? contacts : starterContacts, selectedContactId: contacts[0]?.id ?? starterContacts[0].id, openChats: prev.openChats.filter((id) => id !== activeContact.id), savedNotice: "Chat deleted" };
      });
      return;
    }
    if (action === "pin") {
      setState((prev) => ({ ...prev, savedNotice: `${activeContact.name} is pinned to the top` }));
      return;
    }
    if (action === "mark-read") {
      setState((prev) => ({ ...prev, savedNotice: `${activeContact.name} marked as read` }));
      return;
    }
    setState((prev) => ({ ...prev, savedNotice: `Muted ${activeContact.name} for 8 hours` }));
  };

  const handleMediaSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const newType = file.type.startsWith("video/") ? "video" : file.type === "image/gif" ? "gif" : "image";
    setMediaPreview(url);
    setMediaType(newType);
    setMediaName(file.name);
  };

  const handleClearMedia = () => {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }
    setMediaPreview(null);
    setMediaType(null);
    setMediaName("");
  };

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!state.createMode) return;

    const title = draftName.trim();
    if (!title) return;

    const newContact: Contact = {
      id: `${title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      name: title,
      role: state.createMode === "contact" ? draftRole.trim() || "New connection" : draftDescription.trim() || "Community channel",
      style: "Custom",
      online: true,
      blocked: false,
      messages: [
        {
          id: `${Date.now()}`,
          text: state.createMode === "contact" ? "Welcome to your new connection." : "Community is now live.",
          isMine: false,
        },
      ],
    };

    setState((prev) => ({
      ...prev,
      contacts: [newContact, ...prev.contacts],
      selectedContactId: newContact.id,
      createMode: null,
      savedNotice: `Created ${state.createMode}`,
    }));
    setDraftName("");
    setDraftRole("");
    setDraftDescription("");
    setSearchParams((prev) => {
      prev.delete("create");
      return prev;
    });
  };

  const handleSendMessage = () => {
    if (!state.composer.trim() || !activeContact || activeContact.blocked) return;

    const text = state.composer.trim();
    const outgoing = {
      id: `${Date.now()}`,
      text,
      isMine: true,
    };

    setState((prev) => ({
      ...prev,
      composer: "",
      contacts: prev.contacts.map((contact) => {
        if (contact.id !== prev.selectedContactId) return contact;
        return {
          ...contact,
          typing: true,
          messages: [...contact.messages, outgoing],
        };
      }),
      savedNotice: "Message sent",
    }));

    window.setTimeout(() => {
      setState((prev) => ({
        ...prev,
        contacts: prev.contacts.map((contact) => {
          if (contact.id !== prev.selectedContactId) return contact;
          return {
            ...contact,
            typing: false,
            messages: [
              ...contact.messages,
              {
                id: `reply-${Date.now()}`,
                text: `Got it — I’ve noted: “${text}” and I’m moving it forward for ${contact.name.split(" ")[0]}.`,
                isMine: false,
              },
            ],
          };
        }),
        savedNotice: `Reply delivered to ${activeContact.name}`,
      }));
    }, 700);
  };

  const handleSendGif = (gif: IGif) => {
    if (!activeContact || activeContact.blocked) return;
    const gifUrl = gif.images.fixed_width?.url || gif.images.original?.url;
    if (!gifUrl) return;
    const message = { id: `${Date.now()}`, text: "GIF", gifUrl, isMine: true };
    setState((prev) => ({
      ...prev,
      contacts: prev.contacts.map((contact) => contact.id === prev.selectedContactId ? { ...contact, messages: [...contact.messages, message] } : contact),
      savedNotice: "GIF sent",
    }));
  };

  const handleStyleChange = (style: ChatStyle) => {
    if (!activeContact) return;
    setState((prev) => ({ ...prev, chatStyle: style, contacts: prev.contacts.map((contact) => contact.id === activeContact.id ? { ...contact, style } : contact), savedNotice: `${style} style applied` }));
  };

  const handleAttachment = (file: File) => {
    if (!activeContact || activeContact.blocked) return;
    const mediaType: "image" | "video" = file.type.startsWith("video/") ? "video" : "image";
    const reader = new FileReader();
    reader.onload = () => {
      const mediaUrl = typeof reader.result === "string" ? reader.result : "";
      if (!mediaUrl) return;
      const message = { id: `${Date.now()}`, text: file.name, mediaUrl, mediaType, isMine: true };
      setState((prev) => ({ ...prev, contacts: prev.contacts.map((contact) => contact.id === prev.selectedContactId ? { ...contact, messages: [...contact.messages, message] } : contact), savedNotice: "Attachment sent" }));
    };
    reader.readAsDataURL(file);
  };

  const handleCreatePost = () => {
    if (!newPost.trim() && !mediaPreview) return;

    const post: Post = {
      id: `post-${Date.now()}`,
      author: username ?? "Mixer Creator",
      handle: "@mixer",
      content: newPost.trim(),
      media: mediaPreview || undefined,
      mediaType: mediaType || undefined,
      timestamp: "Just now",
      likes: 0,
      comments: [],
      saved: false,
    };

    setPosts((prev) => [post, ...prev]);
    setNewPost("");
    handleClearMedia();
    setState((prev) => ({ ...prev, savedNotice: "Post published" }));
  };

  const handleCreateStory = () => {
    const text = newStory.trim();
    if (!text) return;
    setStories((prev) => [{ id: `story-${Date.now()}`, author: username ?? "You", text, style: storyStyle }, ...prev]);
    setNewStory("");
    setState((prev) => ({ ...prev, savedNotice: "Story shared" }));
  };

  const handleLike = (id: string) => {
    setPosts((prev) => prev.map((post) => (post.id === id ? { ...post, likes: post.likes + 1 } : post)));
    setState((prev) => ({ ...prev, savedNotice: "Liked a post" }));
  };

  const handleSave = (id: string) => {
    setPosts((prev) => prev.map((post) => (post.id === id ? { ...post, saved: !post.saved } : post)));
    setState((prev) => ({ ...prev, savedNotice: "Saved post updated" }));
  };

  const handleShare = (id: string) => {
    setState((prev) => ({ ...prev, savedNotice: `Shared ${id}` }));
  };

  const handleGenerateAi = (prompt: string, style: string, model: string) => {
    const cleanedPrompt = prompt.trim();
    const headline = cleanedPrompt.length > 48 ? `${cleanedPrompt.slice(0, 48).trim()}...` : cleanedPrompt;
    const result = `${style} • ${model}\n\n${headline}\n\nA polished Mixer post should lead with a sharp hook, speak to a creator-first audience, and end with a clear action like “join the community,” “save this idea,” or “share with your team.” Keep the tone confident, warm, and premium.`;

    setAiHistory((prev) => [{ prompt: cleanedPrompt, result, mode: model }, ...prev]);
    setState((prev) => ({ ...prev, savedNotice: "AI content ready" }));
    setPosts((prev) => [
      {
        id: `ai-${Date.now()}`,
        author: "Mixer AI",
        handle: `@${model.toLowerCase()}`,
        content: result,
        timestamp: "a few seconds ago",
        likes: 0,
        comments: [],
        saved: false,
      },
      ...prev,
    ]);
  };

  const saveWorkspace = () => {
    setState((prev) => ({ ...prev, savedNotice: "Workspace saved locally" }));
  };

  return (
    <div className="space-y-6">
      {state.activeCall && activeContact && state.activeCall !== "Screen" ? <CallPanel mode={state.activeCall} room={activeContact.id} contactName={activeContact.name} onEnd={handleEndCall} /> : null}
      {state.activeCall === "Screen" ? <div className="flex items-center justify-between rounded-3xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-100"><span>Screen sharing is ready in the Mixer workspace.</span><button type="button" onClick={handleEndCall} className="rounded-full border border-emerald-300/30 px-3 py-1">End</button></div> : null}
      <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Mixer Home</p>
            <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Your premium social network studio</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
              Build posts, manage contacts, launch communities, and create AI-powered stories from one futuristic dashboard.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={saveWorkspace} className="rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white">
              Save progress
            </button>
            <Link to="/academy" className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-indigo-500">
              Mixer Academy
            </Link>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-300">
          <span className="rounded-full bg-emerald-500/12 px-3 py-1 text-emerald-300">{username ? `Connected as ${username}` : "Local demo mode"}</span>
          <span className="rounded-full border border-slate-700 px-3 py-1">{state.savedNotice || "Everything saves locally"}</span>
        </div>
      </section>

      {state.createMode ? (
        <section className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Create {state.createMode}</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Launch a new {state.createMode}</h2>
              <p className="mt-2 text-sm text-slate-400">Finish the form below to add a contact, group, or community.</p>
            </div>
            <span className="rounded-full bg-slate-800/80 px-3 py-2 text-sm text-slate-300">{state.createMode}</span>
          </div>

          <form onSubmit={handleCreate} className="mt-6 grid gap-4 lg:grid-cols-2">
            <label className="block text-sm text-slate-300">
              Name
              <input
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white outline-none"
                placeholder="Enter a name"
              />
            </label>

            <label className="block text-sm text-slate-300">
              {state.createMode === "contact" ? "Role" : "Description"}
              <input
                value={state.createMode === "contact" ? draftRole : draftDescription}
                onChange={(event) =>
                  state.createMode === "contact"
                    ? setDraftRole(event.target.value)
                    : setDraftDescription(event.target.value)
                }
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white outline-none"
                placeholder={state.createMode === "contact" ? "Designer, advisor, or creator" : "Community purpose or group topic"}
              />
            </label>

            <div className="lg:col-span-2 flex flex-wrap gap-3">
              <button type="submit" className="rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 hover:opacity-95">
                Create {state.createMode}
              </button>
              <button
                type="button"
                onClick={() => {
                  setState((prev) => ({ ...prev, createMode: null }));
                  setSearchParams((prev) => {
                    prev.delete("create");
                    return prev;
                  });
                }}
                className="rounded-full border border-slate-700 px-5 py-3 text-sm text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="rounded-[28px] border border-white/10 bg-slate-950/80 p-5 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Stories</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">A living pulse of your network</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["Telegram", "WhatsApp", "Discord"] as ChatStyle[]).map((style) => (
              <button key={style} type="button" onClick={() => setStoryStyle(style)} className={`rounded-full px-3 py-2 text-xs font-semibold ${storyStyle === style ? "bg-pink-500 text-white" : "border border-slate-700 text-slate-300"}`}>{style}</button>
            ))}
          </div>
        </div>
        <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
          <div className="min-w-52 rounded-3xl border border-dashed border-pink-400/50 bg-pink-500/10 p-4">
            <input value={newStory} onChange={(event) => setNewStory(event.target.value)} placeholder="Share a quick moment..." className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400" />
            <button type="button" onClick={handleCreateStory} className="mt-4 rounded-full bg-pink-500 px-3 py-2 text-xs font-semibold text-white">Post story</button>
          </div>
          {stories.map((story) => (
            <button type="button" key={story.id} onClick={() => setState((prev) => ({ ...prev, savedNotice: `Opened ${story.author}'s story` }))} className="min-w-52 rounded-3xl border border-slate-700 bg-slate-900/80 p-4 text-left transition hover:border-pink-400">
              <div className="flex items-center justify-between"><span className="text-2xl">{story.style === "Telegram" ? "✦" : story.style === "WhatsApp" ? "◉" : "◈"}</span><span className="text-xs text-slate-500">{story.style}</span></div>
              <p className="mt-6 font-semibold text-white">{story.author}</p><p className="mt-1 text-sm text-slate-400">{story.text}</p>
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.95fr]">
        <section className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Create post</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Post a story or launch update</h2>
              </div>
              <button onClick={handleCreatePost} type="button" className="rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 hover:opacity-95">
                Publish
              </button>
            </div>
            <textarea
              value={newPost}
              onChange={(event) => setNewPost(event.target.value)}
              placeholder="Share a project update, story, or AI-powered caption..."
              className="mt-6 min-h-[140px] w-full rounded-[24px] border border-slate-700 bg-slate-900/80 px-4 py-4 text-sm text-white outline-none transition focus:border-indigo-400"
            />

            <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto]">
              <label className="flex h-14 items-center rounded-[24px] border border-slate-700 bg-slate-900/80 px-4 text-sm text-slate-300">
                <input type="file" accept="image/*,video/*,.gif" onChange={handleMediaSelect} className="hidden" />
                <span>Upload image/video/GIF</span>
              </label>
              {mediaPreview ? (
                <button type="button" onClick={handleClearMedia} className="rounded-full bg-slate-700 px-4 py-3 text-sm text-white transition hover:bg-slate-600">
                  Remove media
                </button>
              ) : null}
            </div>

            {mediaPreview ? (
              <div className="mt-4 overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/80 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Attached file</p>
                <p className="mt-2 text-sm text-slate-300">{mediaName}</p>
                {mediaType === "video" ? (
                  <video controls src={mediaPreview} className="mt-4 w-full rounded-3xl" />
                ) : (
                  <img src={mediaPreview} alt="Post preview" className="mt-4 w-full rounded-3xl object-cover" />
                )}
              </div>
            ) : null}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Contacts</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Your chat network</h2>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {visibleContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => handleContactSelect(contact.id)}
                  className={`group flex cursor-pointer items-center justify-between rounded-3xl border px-4 py-4 transition ${state.selectedContactId === contact.id ? "border-indigo-500 bg-indigo-500/10" : "border-slate-700 bg-slate-900/70"}`}
                >
                  <div>
                    <p className="font-semibold text-white">{contact.name}</p>
                    <p className="text-sm text-slate-400">{contact.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.3em] ${contact.blocked ? "bg-rose-500/15 text-rose-300" : "bg-emerald-500/15 text-emerald-300"}`}>
                      {contact.blocked ? "Blocked" : contact.online ? "Online" : "Offline"}
                    </span>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleToggleBlock(contact.id);
                      }}
                      className={`rounded-full px-3 py-2 text-xs uppercase tracking-[0.2em] transition ${contact.blocked ? "bg-emerald-500 text-slate-950" : "bg-rose-500 text-white"}`}
                    >
                      {contact.blocked ? "Unblock" : "Block"}
                    </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleOpenWindow(contact.id);
                        }}
                        className="rounded-full px-3 py-2 text-xs uppercase tracking-[0.2em] bg-indigo-500 text-white ml-2"
                      >
                        Open
                      </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-5">
            {visiblePosts.map((post) => (
            <PostCard
              key={post.id}
              {...post}
              onLike={handleLike}
              onSave={handleSave}
              onShare={handleShare}
            />
          ))}
        </section>

        {state.openChats.length ? (
          <section className="space-y-4 lg:col-span-2">
            <div className="flex flex-wrap gap-4">
              {state.openChats.map((id) => {
                const c = state.contacts.find((ct) => ct.id === id);
                if (!c) return null;
                return (
                  <div key={id} className="w-full md:w-1/2 lg:w-1/3">
                    <div className="rounded-[20px] border border-white/10 bg-slate-950/80 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white">{c.name}</p>
                          <p className="text-xs text-slate-400">{c.role} · {c.style}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={c.version ?? "Gemini"}
                            onChange={(e) => handleSetVersion(id, e.target.value)}
                            className="rounded px-2 py-1 bg-slate-900 text-sm text-slate-200"
                          >
                            <option>Gemini</option>
                            <option>ChatGPT</option>
                            <option>Claude</option>
                          </select>
                          <button onClick={() => handleCloseWindow(id)} className="rounded-full bg-rose-500 px-3 py-1 text-xs text-white">Close</button>
                        </div>
                      </div>

                      <div className="mt-3">
                        <ChatWindow
                          contact={c}
                          composer={state.composer}
                          onComposerChange={(value) => setState((prev) => ({ ...prev, composer: value }))}
                          onSendMessage={handleSendMessage}
                          onGifSelect={handleSendGif}
                          onCall={handleCall}
                          onChatAction={handleChatAction}
                          onStyleChange={(style) => setState((prev) => ({ ...prev, chatStyle: style, contacts: prev.contacts.map((contact) => contact.id === c.id ? { ...contact, style } : contact), savedNotice: `${style} style applied` }))}
                          onAttachment={handleAttachment}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="space-y-6">
          <ProfileCard
            name="Nova Pulse"
            handle="@nova"
            bio="A creator building premium AI-powered communities and social experiences across Mixer."
            status="Online • crafting stories"
            followers="24.8K"
            following="3.1K"
            posts="128"
            achievements={["AI Master", "Community Host", "Pro Creator"]}
          />

          <AIAssistantPanel onGenerate={handleGenerateAi} history={aiHistory} />

          <NotificationPanel
            notifications={[
              { id: "n1", title: "New follower", message: "Ava joined your Mixer community.", time: "2m ago" },
              { id: "n2", title: "Post saved", message: "Your story has been shared successfully.", time: "18m ago" },
              { id: "n3", title: "AI suggestion ready", message: "A brand tone caption is waiting in the AI studio.", time: "1h ago" },
            ]}
          />
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Live chat</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Message your network</h2>
              </div>
              <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">{activeContact.style}</span>
            </div>

            <div className="mt-5 rounded-[28px] border border-slate-700 bg-slate-950/80 p-5">
              <ChatWindow
                contact={activeContact}
                composer={state.composer}
                onComposerChange={(value) => setState((prev) => ({ ...prev, composer: value }))}
                onSendMessage={handleSendMessage}
                onGifSelect={handleSendGif}
                onCall={handleCall}
                onChatAction={handleChatAction}
                onStyleChange={handleStyleChange}
                onAttachment={handleAttachment}
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Connections</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Quick actions</h2>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {[
                { title: "WhatsApp", subtitle: "Open support chat", icon: "📱", href: "https://wa.me/1234567890", colorClass: "bg-green-600/10 border border-green-500/30" },
                { title: "Telegram", subtitle: "Join the Mixer channel", icon: "✈️", href: "https://t.me/mixerapp", colorClass: "bg-sky-500/10 border border-sky-400/30" },
                { title: "Viber", subtitle: "Stay in sync with updates", icon: "📞", href: "https://www.viber.com/", colorClass: "bg-violet-600/10 border border-violet-500/30" },
                { title: "Google", subtitle: "Sign in with Google", icon: "🔑", href: "#", colorClass: "bg-amber-500/10 border border-amber-400/30" },
              ].map((contact) => (
                <ContactButton key={contact.title} {...contact} />
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Mixer Academy</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Interactive tutorials</h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <TutorialCard title="Build your first community" description="Launch a premium group and invite your first creators." progress={78} badge="Beginner" />
              <TutorialCard title="AI caption creator" description="Use AI to rewrite your post text in any tone." progress={56} badge="Creator" />
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Communities</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Live rooms</h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <CommunityCard title="Design Futures" description="Share premium visual stories and theme-driven updates." members="5.4K" activity="Active" category="Design" />
              <CommunityCard title="AI Voice Lab" description="Launch next-level reels, captions, and marketing posts." members="3.1K" activity="Live" category="AI" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
