import { create } from "zustand";

interface DemoState {
  isDemoMode: boolean;
  demoRole: "job_seeker" | "recruiter";
  showAuthModal: boolean;
  authModalFeature: string;
  demoStartTime: number | null;
  demoExpired: boolean;

  enableDemo: (role?: "job_seeker" | "recruiter") => void;
  disableDemo: () => void;
  openAuthModal: (feature: string) => void;
  closeAuthModal: () => void;
  expireDemo: () => void;
  clearExpired: () => void;
}

const DEMO_MODE_KEY = "hirenext_demo_mode";
const DEMO_START_KEY = "demoStartTime";
const DEMO_EXPIRED_KEY = "demoExpired";
const DEMO_USER_KEY = "demoUser";
const DEMO_ROLE_KEY = "demoRole";

function readDemoStart(): number | null {
  const raw = localStorage.getItem(DEMO_START_KEY);
  if (!raw) return null;
  const parsed = parseInt(raw, 10);
  return isNaN(parsed) ? null : parsed;
}

function readDemoExpired(): boolean {
  return localStorage.getItem(DEMO_EXPIRED_KEY) === "true";
}

export const useDemoStore = create<DemoState>((set) => ({
  isDemoMode: localStorage.getItem(DEMO_MODE_KEY) === "true",
  demoRole: (localStorage.getItem(DEMO_ROLE_KEY) as "job_seeker" | "recruiter" | null) ?? "job_seeker",
  showAuthModal: false,
  authModalFeature: "",
  demoStartTime: readDemoStart(),
  demoExpired: readDemoExpired(),

  enableDemo: (role = "job_seeker") => {
    const now = Date.now();
    localStorage.setItem(DEMO_MODE_KEY, "true");
    localStorage.setItem(DEMO_START_KEY, String(now));
    localStorage.setItem(DEMO_ROLE_KEY, role);
    localStorage.removeItem(DEMO_EXPIRED_KEY);
    set({ isDemoMode: true, demoStartTime: now, demoExpired: false, demoRole: role });
  },

  disableDemo: () => {
    localStorage.removeItem(DEMO_MODE_KEY);
    localStorage.removeItem(DEMO_START_KEY);
    localStorage.removeItem(DEMO_EXPIRED_KEY);
    localStorage.removeItem(DEMO_USER_KEY);
    localStorage.removeItem(DEMO_ROLE_KEY);
    set({ isDemoMode: false, showAuthModal: false, demoStartTime: null, demoExpired: false, demoRole: "job_seeker" });
  },

  expireDemo: () => {
    localStorage.setItem(DEMO_EXPIRED_KEY, "true");
    localStorage.removeItem(DEMO_MODE_KEY);
    localStorage.removeItem(DEMO_USER_KEY);
    set({ isDemoMode: false, demoExpired: true });
  },

  clearExpired: () => {
    localStorage.removeItem(DEMO_EXPIRED_KEY);
    localStorage.removeItem(DEMO_START_KEY);
    localStorage.removeItem(DEMO_USER_KEY);
    set({ demoExpired: false, demoStartTime: null });
  },

  openAuthModal: (feature: string) => {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
      return;
    }
    set({ showAuthModal: true, authModalFeature: feature });
  },

  closeAuthModal: () => {
    set({ showAuthModal: false, authModalFeature: "" });
  },
}));
