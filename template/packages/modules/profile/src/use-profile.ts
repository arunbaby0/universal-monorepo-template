import { create } from "zustand";
import type { UserProfile, UpdateProfileInput } from "@repo/types";
import { getApiUrl } from "@repo/types";

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchProfile: (userId: number) => Promise<void>;
  updateProfile: (data: UpdateProfileInput) => Promise<void>;
  clearProfile: () => void;
  clearError: () => void;
}

export const useProfile = create<ProfileState>()((set, get) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async (userId) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${getApiUrl()}/api/profiles/${userId}`, {
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 404) {
          // Profile doesn't exist yet, that's okay
          set({ profile: null, loading: false });
          return;
        }
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch profile");
      }

      const data = await res.json();
      set({ profile: data.profile, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch profile",
        loading: false,
      });
    }
  },

  updateProfile: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${getApiUrl()}/api/profiles`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const resData = await res.json();
        throw new Error(resData.error || "Failed to update profile");
      }

      const resData = await res.json();
      set({ profile: resData.profile, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to update profile",
        loading: false,
      });
      throw err;
    }
  },

  clearProfile: () => set({ profile: null, error: null }),

  clearError: () => set({ error: null }),
}));
