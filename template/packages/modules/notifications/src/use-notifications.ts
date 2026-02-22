import { create } from "zustand";
import type { Notification, NotificationType } from "@repo/types";

interface NotificationInput {
  type: NotificationType;
  message: string;
  duration?: number; // ms, default 5000
}

interface NotificationsState {
  notifications: Notification[];

  // Actions
  addNotification: (input: NotificationInput) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useNotifications = create<NotificationsState>()((set, get) => ({
  notifications: [],

  addNotification: (input) => {
    const id = generateId();
    const notification: Notification = {
      id,
      type: input.type,
      message: input.message,
      timestamp: Date.now(),
    };

    set((state) => ({
      notifications: [...state.notifications, notification],
    }));

    // Auto-dismiss after duration (default 5s)
    const duration = input.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, duration);
    }

    return id;
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearAll: () => set({ notifications: [] }),
}));

// Convenience helpers
export const notify = {
  success: (message: string, duration?: number) =>
    useNotifications.getState().addNotification({ type: "success", message, duration }),
  error: (message: string, duration?: number) =>
    useNotifications.getState().addNotification({ type: "error", message, duration }),
  warning: (message: string, duration?: number) =>
    useNotifications.getState().addNotification({ type: "warning", message, duration }),
  info: (message: string, duration?: number) =>
    useNotifications.getState().addNotification({ type: "info", message, duration }),
};
