import { create } from "zustand";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  hydrateFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true });
  },

  clearAuth: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    set({ user: null, token: null, isAuthenticated: false });
  },

  hydrateFromStorage: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");
    if (token && userRaw) {
      try {
        const user = JSON.parse(userRaw) as User;
        set({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  },
}));
