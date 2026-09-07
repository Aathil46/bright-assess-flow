import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthLayout, RoleSelector } from "@/components/auth-layout";
import { defaultUsers, roleHome, signIn } from "@/lib/session";
import type { Role } from "@/lib/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in · AI Smart Assessment" },
      {
        name: "description",
        content:
          "Sign in to AI Smart Assessment as a teacher, student or principal to review concept-level learning analytics.",
      },
      { property: "og:title", content: "Sign in · AI Smart Assessment" },
      {
        property: "og:description",
        content: "Concept-level assessment and learning analytics for schools.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("teacher");
  const [email, setEmail] = useState(defaultUsers.teacher.email);
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleRole = (next: Role) => {
    setRole(next);
    setEmail(defaultUsers[next].email);
    setAuthError(null);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { email?: string; password?: string } = {};
    if (!email.trim()) nextErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Enter a valid email address.";
    if (!password) nextErrors.password = "Password is required.";
    else if (password.length < 6) nextErrors.password = "Password must be at least 6 characters.";
    setErrors(nextErrors);
    setAuthError(null);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    window.setTimeout(() => {
      if (password === "wrong") {
        setLoading(false);
        setAuthError("Invalid email or password. Please try again.");
        return;
      }
      signIn({ ...defaultUsers[role], email });
      void navigate({ to: roleHome[role] });
    }, 700);
  };

  return (
    <AuthLayout
      role={role}
      title="Sign in"
      subtitle="Choose your role and continue to your workspace."
    >
      <form onSubmit={submit} noValidate className="space-y-5">
        <RoleSelector value={role} onChange={handleRole} />

        {authError ? (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-weak-soft px-3 py-2.5 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>{authError}</span>
          </div>
        ) : null}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email <span className="text-destructive">*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus-visible:border-primary"
          />
          {errors.email ? (
            <p id="email-error" className="mt-1 text-xs text-destructive">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
            Password <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : "password-hint"}
              className="h-11 w-full rounded-md border border-input bg-card px-3 pr-11 text-sm outline-none focus-visible:border-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password ? (
            <p id="password-error" className="mt-1 text-xs text-destructive">
              {errors.password}
            </p>
          ) : (
            <p id="password-hint" className="mt-1 text-xs text-muted-foreground">
              Demo prototype — any password works. Type “wrong” to preview the error state.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-4 rounded border-input accent-[var(--primary)]"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Create account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
