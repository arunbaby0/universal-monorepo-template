import { create } from "zustand";
import type { Note, CreateNoteInput, UpdateNoteInput } from "@repo/types";
import { getApiUrl } from "@repo/types";

interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchNotes: () => Promise<void>;
  createNote: (input: CreateNoteInput) => Promise<void>;
  updateNote: (id: number, input: UpdateNoteInput) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useNotes = create<NotesState>()((set, get) => ({
  notes: [],
  loading: false,
  error: null,

  fetchNotes: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${getApiUrl()}/api/notes`, {
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch notes");
      }

      const data = await res.json();
      set({ notes: data.notes, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch notes",
        loading: false,
      });
    }
  },

  createNote: async (input) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${getApiUrl()}/api/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create note");
      }

      const data = await res.json();
      set((state) => ({ notes: [data.note, ...state.notes], loading: false }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to create note",
        loading: false,
      });
      throw err;
    }
  },

  updateNote: async (id, input) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${getApiUrl()}/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update note");
      }

      const data = await res.json();
      set((state) => ({
        notes: state.notes.map((n) => (n.id === id ? data.note : n)),
        loading: false,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to update note",
        loading: false,
      });
      throw err;
    }
  },

  deleteNote: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${getApiUrl()}/api/notes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete note");
      }

      set((state) => ({
        notes: state.notes.filter((n) => n.id !== id),
        loading: false,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to delete note",
        loading: false,
      });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
