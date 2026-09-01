import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { clearToken } from "./api";
import BrandMark from "./components/BrandMark";
import { useAuth } from "./lib/auth-context";

const navItems = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/favorites", label: "Saved", icon: "⭐" },
  { to: "/bots", label: "AI Lab", icon: "🤖" },
  { to: "/academy", label: "Academy", icon: "🎓" },
  { to: "/profile", label: "Profile", icon: "👤" },
  { to: "/settings", label: "Settings", icon: "⚙️" },
  { to: "/about", label: "About", icon: "✨" },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, configured, loading, user } = useAuth();
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">(() => (typeof window !== "undefined" ? (window.localStorage.getItem("mixer-theme") as "dark" | "light") || "dark" : "dark"));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("mixer-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (configured && !loading && !user) navigate("/login", { replace: true });
  }, [configured, loading, navigate, user]);

  const title = useMemo(() => {
    if (location.pathname.includes("/profile")) return "Profile";
    if (location.pathname.includes("/settings")) return "Settings";
    if (location.pathname.includes("/favorites")) return "Saved";
    if (location.pathname.includes("/bots")) return "AI Lab";
    if (location.pathname.includes("/academy")) return "Academy";
    if (location.pathname.includes("/about")) return "About";
    return "Mixer Home";
  }, [location.pathname]);

  const handleLogout = () => {
    clearToken();
    window.localStorage.removeItem("skychat-state-v1");
    if (configured) void signOut();
    navigate("/login");
  };

  const openCreate = (mode: "contact" | "group" | "community") => {
    setCreateMenuOpen(false);
    navigate(`/?create=${mode}`);
  };

  const handleInvite = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setNotice("Invite link copied");
    } catch {
      setNotice("Share this page to invite someone");
    }
    window.setTimeout(() => setNotice(""), 2500);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.22),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#111827_45%,_#0f172a_100%)] px-3 py-3 text-slate-100 sm:px-4 lg:px-6">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-4 lg:flex-row">
        <aside className="w-full rounded-[28px] border border-white/10 bg-slate-900/80 p-4 shadow-2xl shadow-black/30 backdrop-blur lg:w-72">
          <div className="flex items-center gap-3">
            <BrandMark size="md" />
            <div>
              <p className="text-sm font-semibold">Mixer</p>
              <p className="text-xs text-slate-400">Connect, create, and shine</p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-slate-800/80 p-4 shadow-inner shadow-slate-950/20">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Quick Actions</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCreateMenuOpen((prev) => !prev)}
                className="rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-3 py-2 text-sm font-semibold"
              >
                + Create
              </button>
              <button type="button" onClick={handleInvite} className="rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-300">
                Invite
              </button>
            </div>
            {createMenuOpen && (
              <div className="mt-3 grid gap-2 text-sm text-slate-300">
                <button type="button" onClick={() => openCreate("contact")} className="rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-left">
                  Add contact
                </button>
                <button type="button" onClick={() => openCreate("group")} className="rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-left">
                  New group
                </button>
                <button type="button" onClick={() => openCreate("community")} className="rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-left">
                  Launch community
                </button>
              </div>
            )}
          </div>

          <nav className="mt-6 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-2xl px-3 py-3 text-sm transition ${
                    isActive ? "bg-white/12 text-white shadow-lg" : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <span className="flex items-center gap-3">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 rounded-3xl border border-indigo-500/20 bg-indigo-500/10 p-4">
            <p className="text-sm font-semibold">Premium social OS</p>
            <p className="mt-1 text-sm text-slate-300">Mixer brings chat, communities, AI, and identity into one polished hub for modern creators.</p>
          </div>
        </aside>

        <div className="flex-1 rounded-[28px] border border-white/10 bg-slate-950/70 p-3 shadow-2xl shadow-black/20 backdrop-blur sm:p-4 lg:p-5">
          <header className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-white/10 bg-slate-900/80 px-4 py-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-pink-400">{title}</p>
              <h1 className="text-xl font-semibold text-white">Your ready workspace</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <form onSubmit={(event) => { event.preventDefault(); navigate(search.trim() ? `/?q=${encodeURIComponent(search.trim())}` : "/"); }} className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-slate-300">
                <span>🔎</span>
                <input value={search} onChange={(event) => setSearch(event.target.value)} className="w-28 bg-transparent outline-none sm:w-40" placeholder="Search" />
              </form>
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full border border-slate-700 bg-slate-800/80 px-4 py-2 text-sm text-slate-300"
              >
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </button>
              <button type="button" className="rounded-full border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-slate-300" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </header>

          <main className="mt-4 transition-all duration-500">
            {notice ? <div role="status" className="mb-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{notice}</div> : null}
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
