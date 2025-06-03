import { create } from 'zustand';

export type Notification = {
  id: number;
  message: string;
  date: string;
  lu: boolean; // ✅ notification lue ou non
};

type NotificationStore = {
  notifications: Notification[];
  addNotification: (msg: string) => void;
  markAllAsRead: () => void;
  hasUnread: () => boolean;
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  addNotification: (msg) =>
    set((state) => ({
      notifications: [
        {
          id: Date.now(),
          message: msg,
          date: new Date().toLocaleString(),
          lu: false,
        },
        ...state.notifications,
      ],
    })),
  markAllAsRead: () =>
    set({
      notifications: get().notifications.map((n) => ({
        ...n,
        lu: true,
      })),
    }),
  hasUnread: () => get().notifications.some((n) => !n.lu),
}));
