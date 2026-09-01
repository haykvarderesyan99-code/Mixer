import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { handleSignup } from "../src/api";
import { validateSignup } from "../src/helpers/SignupValidator";
import type { SignupForm, SignupErrors } from "../src/types";

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      username: "",
      password: "",
      acceptedTerms: false,
    },
  });

  const onSubmit = async (data: SignupForm) => {
    clearErrors();
    setSubmitError("");

    const validationErrors = validateSignup(data) as SignupErrors;
    const hasValidationErrors = Object.keys(validationErrors).length > 0;

    if (hasValidationErrors) {
      Object.entries(validationErrors).forEach(([key, value]) => {
        if (key !== "general" && value) {
          setError(key as keyof SignupForm, { type: "manual", message: value });
        }
      });

      if (validationErrors.general) {
        setSubmitError(validationErrors.general);
      }
      return;
    }

    try {
      await handleSignup(data);
      navigate("/login");
    } catch {
      setSubmitError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.22),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#111827_45%,_#0f172a_100%)] px-4 py-8 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900 shadow-2xl lg:grid-cols-2">
          <div className="hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold">Join Mixer</h1>
              <p className="mt-4 text-indigo-100">Create your premium social brand and access AI-powered communities.</p>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl bg-white/20 p-4">✦ Modern design</div>
              <div className="rounded-xl bg-white/20 p-4">✓ Secure account</div>
            </div>
          </div>

          <div className="p-8 sm:p-12">
            <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Sign Up</p>
            <h2 className="mt-3 text-4xl font-semibold">Create your account</h2>
            <p className="mt-2 text-sm text-slate-400">Register now to build your Mixer presence and AI-enabled community.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300" htmlFor="firstname">
                    First name
                  </label>
                  <input
                    id="firstname"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-indigo-400"
                    placeholder="First name"
                    {...register("firstname", { required: "First name is required", minLength: { value: 2, message: "First name must contain at least 2 characters" } })}
                  />
                  {errors.firstname && <p className="mt-2 text-sm text-rose-400">{errors.firstname.message}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300" htmlFor="lastname">
                    Last name
                  </label>
                  <input
                    id="lastname"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-indigo-400"
                    placeholder="Last name"
                    {...register("lastname", { required: "Last name is required", minLength: { value: 2, message: "Last name must contain at least 2 characters" } })}
                  />
                  {errors.lastname && <p className="mt-2 text-sm text-rose-400">{errors.lastname.message}</p>}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300" htmlFor="email">Email</label>
                <input id="email" type="email" autoComplete="email" className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-indigo-400" placeholder="you@example.com" {...register("email", { required: "Email is required" })} />
                {errors.email && <p className="mt-2 text-sm text-rose-400">{errors.email.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300" htmlFor="username">
                  Username
                </label>
                <input
                  id="username"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-indigo-400"
                  placeholder="Choose a username"
                  {...register("username", { required: "Username is required", minLength: { value: 3, message: "Username must be at least 3 characters" } })}
                />
                {errors.username && <p className="mt-2 text-sm text-rose-400">{errors.username.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 pr-12 text-white outline-none transition focus:border-indigo-400"
                    placeholder="Choose a strong password"
                    {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters" } })}
                  />
                  <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 transition hover:text-white">
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.password && <p className="mt-2 text-sm text-rose-400">{errors.password.message}</p>}
              </div>

              <label className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-800/80 p-4 text-sm text-slate-300">
                <input type="checkbox" className="mt-1" {...register("acceptedTerms", { validate: (value) => value || "You must accept the terms and privacy policy" })} />
                <span>I agree to the terms and privacy policy.</span>
              </label>
              {errors.acceptedTerms && <p className="text-sm text-rose-400">{errors.acceptedTerms.message}</p>}

              {submitError && <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{submitError}</div>}

              <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 py-3 font-semibold transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70">
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-400">
              Already have an account?
              <Link to="/login" className="ml-2 font-medium text-indigo-300">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
