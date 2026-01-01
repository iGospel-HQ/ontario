import { create } from "zustand";
import Cookies from "js-cookie";
import api from "@/lib/api-client";

interface User {
  user_id: string;
  email: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  refreshAccessToken: () => Promise<boolean | undefined>;
}

const REFRESH_TOKEN_KEY = "refresh_token";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start as loading to check for existing session

  setTokens: (access: string, refresh: string) => {
    Cookies.set(REFRESH_TOKEN_KEY, refresh, {
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    set({ accessToken: access, isAuthenticated: true });
  },

  setUser: (user: User) => {
    set({ user });
  },

  logout: () => {
    Cookies.remove(REFRESH_TOKEN_KEY);
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  refreshAccessToken: async () => {
    const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      set({ isLoading: false, isAuthenticated: false });
      return false;
    }

    try {
      console.log("Attempting to refresh access token");
      const response = await api.post(`/auth/refresh`, {
        refresh: refreshToken,
      });

      const data = response.data;

      if (data.status === "success" && data.data?.access) {
        console.log("Successfully refreshed access token");
        set({
          accessToken: data.data.access,
          isAuthenticated: true,
          isLoading: false,
        });

        // Optionally update user data if provided
        if (data.data.user_id && data.data.email) {
          set({
            user: {
              user_id: data.data.user_id,
              email: data.data.email,
            },
          });
        }

        return true;
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      get().logout();
      return false;
    }
  },
}));
