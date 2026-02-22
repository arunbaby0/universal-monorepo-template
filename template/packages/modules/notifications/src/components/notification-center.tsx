"use client";

import { useNotifications } from "../use-notifications";
import type { NotificationType } from "@repo/types";

const typeStyles: Record<NotificationType, string> = {
  success: "bg-green-500 text-white",
  error: "bg-red-500 text-white",
  warning: "bg-yellow-500 text-black",
  info: "bg-blue-500 text-white",
};

const typeIcons: Record<NotificationType, string> = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

export function NotificationCenter() {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            ${typeStyles[notification.type]}
            px-4 py-3 rounded-lg shadow-lg
            flex items-start gap-3
            animate-in slide-in-from-right duration-200
          `}
          role="alert"
        >
          <span className="text-lg font-bold">{typeIcons[notification.type]}</span>
          <p className="flex-1 text-sm font-medium">{notification.message}</p>
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-current opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
