import { create } from "zustand";
import { getUserProfile, logOut } from "@/app/api/user";

interface AuthState {
  user: any | null;
  isLoggedIn: boolean;
  loading: boolean;
  hasFetched: boolean; // ✅ new flag to avoid repeated fetch
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoggedIn: false,
  loading: true,
  hasFetched: false,

  fetchUser: async () => {
    // ✅ Only fetch if not already fetched
    if (get().hasFetched) return;

    try {
      const userData = await getUserProfile();
      set({
        user: userData,
        isLoggedIn: true,
        loading: false,
        hasFetched: true,
      });
    } catch {
      set({
        user: null,
        isLoggedIn: false,
        loading: false,
        hasFetched: true,
      });
    }
  },

  logout: async () => {
    try {
      await logOut();
    } catch (err) {
      console.error("Logout failed", err);
    }
    // ✅ clear user and reset hasFetched so profile can be refetched next login
    set({ user: null, isLoggedIn: false, hasFetched: false });
  },
}));
