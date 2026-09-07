import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  Brain,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Library,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  School,
  Sparkles,
  Target,
  TrendingUp,
  User,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { roleLabel, signOut, useSession } from "@/lib/session";
import type { Role } from "@/lib/types";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const navByRole: Record<Role, NavItem[]> = {
  teacher: [
    { to: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/teacher/classes", label: "Classes", icon: Users },
    { to: "/teacher/materials", label: "Learning Materials", icon: Library },
    { to: "/teacher/assessments", label: "Assessments", icon: ClipboardList },
    { to: "/teacher/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/teacher/profile", label: "Profile", icon: User },
  ],
  student: [
    { to: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/student/classes", label: "My Classes", icon: GraduationCap },
    { to: "/student/assessments", label: "Assessments", icon: ClipboardList },
    { to: "/student/results", label: "Results", icon: TrendingUp },
    { to: "/student/practice", label: "Practice", icon: BookOpen },
  ],
  principal: [
    { to: "/principal/overview", label: "School Overview", icon: School },
    { to: "/principal/classes", label: "Classes", icon: Users },
    { to: "/principal/teachers", label: "Teachers", icon: GraduationCap },
    { to: "/principal/assessments", label: "Assessments", icon: ClipboardList },
    { to: "/principal/weak-concepts", label: "Weak Concepts", icon: Target },
    { to: "/principal/weak-students", label: "Weak Students", icon: Users },
    { to: "/principal/ai-review", label: "AI Review", icon: Brain },
  ],
};

function NavList({
  role,
  collapsed,
  onNavigate,
}: {
  role: Role;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <ul className="space-y-1">
      {navByRole[role].map((item) => {
        const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
        return (
          <li key={item.to}>
            <Link
              to={item.to}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                "text-navy-muted hover:bg-white/10 hover:text-navy-foreground",
                active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                collapsed && "justify-center px-2",
              )}
            >
              <item.icon className="size-5 shrink-0" aria-hidden />
              <span className={cn(collapsed && "sr-only")}>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5 px-3 py-1", collapsed && "justify-center px-0")}>
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Sparkles className="size-5" aria-hidden />
      </span>
      {!collapsed && (
        <span className="font-display text-[15px] leading-tight font-bold text-navy-foreground">
          AI Smart
          <span className="block text-xs font-medium text-navy-muted">Assessment</span>
        </span>
      )}
    </div>
  );
}

export function AppShell({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const session = useSession();
  const navigate = useNavigate();

  const user = session ?? {
    name: "Guest",
    email: "",
    role,
    school: "Brightfield Public School",
  };

  const handleLogout = () => {
    signOut();
    void navigate({ to: "/" });
  };

  return (
    <div data-role={role} className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden flex-col bg-navy px-3 py-4 lg:flex",
          collapsed ? "w-[76px]" : "w-60",
        )}
      >
        <Brand collapsed={collapsed} />
        <nav aria-label="Main navigation" className="mt-6 flex-1 overflow-y-auto">
          <NavList role={role} collapsed={collapsed} />
        </nav>
        <div className="space-y-1 border-t border-white/10 pt-3">
          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-navy-muted hover:bg-white/10 hover:text-navy-foreground",
              collapsed && "justify-center px-2",
            )}
          >
            <LogOut className="size-5 shrink-0" aria-hidden />
            <span className={cn(collapsed && "sr-only")}>Log out</span>
          </button>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-navy-muted hover:bg-white/10 hover:text-navy-foreground",
              collapsed && "justify-center px-2",
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-5 shrink-0" aria-hidden />
            ) : (
              <PanelLeftClose className="size-5 shrink-0" aria-hidden />
            )}
            <span className={cn(collapsed && "sr-only")}>Collapse</span>
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-navy/50"
            onClick={() => setMobileOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="relative flex h-full w-72 max-w-[85vw] flex-col bg-navy px-3 py-4"
          >
            <div className="flex items-center justify-between">
              <Brand collapsed={false} />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="rounded-md p-2 text-navy-muted hover:bg-white/10 hover:text-navy-foreground"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <nav aria-label="Main navigation" className="mt-6 flex-1 overflow-y-auto">
              <NavList role={role} collapsed={false} onNavigate={() => setMobileOpen(false)} />
            </nav>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-navy-muted hover:bg-white/10 hover:text-navy-foreground"
            >
              <LogOut className="size-5" aria-hidden />
              Log out
            </button>
          </div>
        </div>
      ) : null}

      <div className={cn("flex min-h-screen flex-col", collapsed ? "lg:pl-[76px]" : "lg:pl-60")}>
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-card/90 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-md p-2 text-muted-foreground hover:bg-secondary lg:hidden"
          >
            <Menu className="size-5" aria-hidden />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user.school}</p>
            <p className="truncate text-xs text-muted-foreground">
              {roleLabel[role]} workspace
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary sm:inline">
              {roleLabel[role]}
            </span>
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-full bg-navy text-sm font-semibold text-navy-foreground">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <span className="hidden text-sm font-medium sm:inline">{user.name}</span>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
