import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { AuthLayout, RoleSelector } from "@/components/auth-layout";
import { defaultUsers, roleHome, signIn } from "@/lib/session";
import type { Role } from "@/lib/types";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account · AI Smart Assessment" },
      {
        name: "description",
        content:
          "Create a teacher, student or principal account to start using AI Smart Assessment.",
      },
      { property: "og:title", content: "Create account · AI Smart Assessment" },
      {
        property: "og:description",
        content: "Create a teacher, student or principal account on AI Smart Assessment.",
      },
    ],
  }),
  component: SignupPage,
});

type Errors = Partial<Record<"name" | "email" | "password" | "confirm" | "school", string>>;

function SignupPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("teacher");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    school: "Brightfield Public School",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Full name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.password.length < 8) next.password = "Use at least 8 characters.";
    if (form.confirm !== form.password) next.confirm = "Passwords do not match.";
    if (role !== "student" && !form.school.trim())
      next.school = "School name or code is required.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    window.setTimeout(() => {
      signIn({
        ...defaultUsers[role],
        name: form.name,
        email: form.email,
        school: role === "student" ? defaultUsers[role].school : form.school,
      });
      void navigate({ to: roleHome[role] });
    }, 800);
  };

  const field = (
    id: keyof typeof form,
    label: string,
    type: string,
    autoComplete: string,
    hint?: string,
  ) => (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label} <span className="text-destructive">*</span>
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={form[id]}
        onChange={set(id)}
        aria-invalid={!!errors[id]}
        aria-describedby={errors[id] ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus-visible:border-primary"
      />
      {errors[id] ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-destructive">
          {errors[id]}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );

  return (
    <AuthLayout
      role={role}
      title="Create your account"
      subtitle="Set up your workspace in under a minute."
    >
      <form onSubmit={submit} noValidate className="space-y-5">
        <RoleSelector value={role} onChange={setRole} id="signup-role" />
        {field("name", "Full name", "text", "name")}
        {field("email", "Email", "email", "email")}
        {role === "student"
          ? null
          : field("school", "School name or code", "text", "organization")}
        {field("password", "Password", "password", "new-password", "At least 8 characters.")}
        {field("confirm", "Confirm password", "password", "new-password")}

        {role === "student" ? (
          <p className="rounded-lg border border-border bg-secondary/60 px-3 py-2.5 text-xs text-muted-foreground">
            Students join a class after signing in, using the 6-character code from their teacher.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {loading ? "Creating account…" : "Create account"}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
