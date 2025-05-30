import { create } from 'zustand';

export type Notification = {
  id: number;
  message: string;
  date: string;
};

type NotificationStore = {
  notifications: Notification[];
  addNotification: (msg: string) => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (msg) =>
    set((state) => ({
      notifications: [
        {
          id: Date.now(),
          message: msg,
          date: new Date().toLocaleString(),
        },
        ...state.notifications,
      ],
    })),
}));
