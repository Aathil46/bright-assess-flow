import { useSyncExternalStore } from "react";
import type { Role } from "./types";

export interface SessionUser {
  name: string;
  email: string;
  role: Role;
  school: string;
}

const KEY = "asa.session";

let session: SessionUser | null = null;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) session = JSON.parse(raw) as SessionUser;
  } catch {
    session = null;
  }
}

export function signIn(user: SessionUser) {
  session = user;
  hydrated = true;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(user));
  } catch {
    /* ignore */
  }
  emit();
}

export function signOut() {
  session = null;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  emit();
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSession(): SessionUser | null {
  return useSyncExternalStore(
    subscribe,
    () => {
      hydrate();
      return session;
    },
    () => null,
  );
}

export const defaultUsers: Record<Role, SessionUser> = {
  teacher: {
    name: "Priya Raman",
    email: "priya.raman@brightfield.edu",
    role: "teacher",
    school: "Brightfield Public School",
  },
  student: {
    name: "Aarav Sharma",
    email: "aarav.sharma@brightfield.edu",
    role: "student",
    school: "Brightfield Public School",
  },
  principal: {
    name: "Ravi Deshmukh",
    email: "ravi.deshmukh@brightfield.edu",
    role: "principal",
    school: "Brightfield Public School",
  },
};

export const roleHome: Record<Role, string> = {
  teacher: "/teacher/dashboard",
  student: "/student/dashboard",
  principal: "/principal/overview",
};

export const roleLabel: Record<Role, string> = {
  teacher: "Teacher",
  student: "Student",
  principal: "Principal",
};
