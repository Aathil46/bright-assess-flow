import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Loader2, MailCheck } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password · AI Smart Assessment" },
      {
        name: "description",
        content: "Request a password reset link for your AI Smart Assessment account.",
      },
      { property: "og:title", content: "Reset password · AI Smart Assessment" },
      {
        property: "og:description",
        content: "Request a password reset link for your AI Smart Assessment account.",
      },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 700);
  };

  return (
    <AuthLayout
      role="teacher"
      title="Reset your password"
      subtitle="We'll email you a link to choose a new password."
    >
      {sent ? (
        <div className="space-y-5">
          <div className="flex items-start gap-3 rounded-lg border border-strong/30 bg-strong-soft px-4 py-3 text-sm">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-strong" aria-hidden />
            <div>
              <p className="font-semibold text-strong">Reset link sent</p>
              <p className="mt-0.5 text-foreground/70">
                If an account exists for {email}, a reset link is on its way.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-4 py-3 text-xs text-muted-foreground">
            <MailCheck className="size-4 shrink-0" aria-hidden />
            Prototype only — no email is actually sent.
          </div>
          <Link
            to="/"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-5">
          <div>
            <label htmlFor="reset-email" className="mb-1.5 block text-sm font-medium">
              Email <span className="text-destructive">*</span>
            </label>
            <input
              id="reset-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!error}
              aria-describedby={error ? "reset-error" : undefined}
              className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus-visible:border-primary"
            />
            {error ? (
              <p id="reset-error" className="mt-1 text-xs text-destructive">
                {error}
              </p>
            ) : null}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            {loading ? "Sending link…" : "Send reset link"}
          </button>
          <Link
            to="/"
            className="flex items-center justify-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to sign in
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}
