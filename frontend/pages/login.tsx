import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { handleLogin } from "../src/api";
import { useAuth } from "../src/lib/auth-context";

type LoginFormValues = {
  username: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();
  const { configured } = useAuth();
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setSubmitError("");
    setSuccessMessage("");

    try {
      const { error } = await handleLogin(data);
      if (error) {
        setSubmitError(
          error.message === "Invalid login credentials"
            ? "Wrong email or password. Please try again."
            : error.message,
        );
        return;
      }
      setSuccessMessage("Login successful");
      navigate("/");
    } catch {
      setSubmitError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.22),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#111827_45%,_#0f172a_100%)] px-4 py-8 text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-black/30">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-indigo-500 to-sky-500 text-xl font-black text-white">M</div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Mixer login</p>
            <h1 className="mt-1 text-2xl font-semibold">Welcome back</h1>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-400">Sign in to access your premium social network and connected communities.</p>

        {!configured ? (
          <div role="alert" className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            Supabase is not configured. Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> in <code>frontend/.env.local</code>, then restart the dev server.
          </div>
        ) : null}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300" htmlFor="username">
              Email
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-indigo-400"
              placeholder="Enter your email"
              {...register("username", { required: "Email is required", pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email" } })}
            />
            {errors.username && <p className="mt-2 text-sm text-rose-400">{errors.username.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-indigo-400"
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <p className="mt-2 text-sm text-rose-400">{errors.password.message}</p>}
          </div>

          {submitError && <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{submitError}</div>}
          {successMessage && <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{successMessage}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 py-3 font-semibold transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don’t have an account?
          <Link to="/signup" className="ml-2 font-medium text-indigo-300">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
