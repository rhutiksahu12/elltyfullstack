"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "../lib/api";

interface User {
  id: string;
  username: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggingOut: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoggingOut: false,
      setAuth: (user, token) => {
        localStorage.setItem("token", token);
        set({ user, token });
      },
      logout: async () => {
        // localStorage.removeItem("token");
        // set({ user: null, token: null });
        set({ isLoggingOut: true });

        try {
          await authApi.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          localStorage.removeItem("token");
          set({ user: null, token: null, isLoggingOut: false });
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
        }
      },
      isAuthenticated: () => {
        const token = get().token;
        if (!token) return false;

        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const exp = payload.exp * 1000
          return Date.now() < exp;
        } catch {
          return false;
        }
      }

    }),
    {
      name: "auth-storage",
    }
  )
);
