import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  notifications: [
    {
      id: 1,
      title: 'DBMS Assignment Posted',
      message: 'Prof. Sharma posted Assignment 3: "ER Diagram & Normalization" due this Friday 11:59 PM.',
      type: 'assignment',
      time: '10m ago',
      read: false,
    },
    {
      id: 2,
      title: 'Mid-Term Exam Schedule',
      message: 'Mid-term exams for Semester 4 have been published. Check the Academic Calendar for your slot.',
      type: 'exam',
      time: '1h ago',
      read: false,
    },
    {
      id: 3,
      title: 'Hackathon Registration Open',
      message: 'Genesis 2.0 Hackathon registrations are now live! Form teams of 3–4 and register before April 15.',
      type: 'event',
      time: '3h ago',
      read: true,
    },
    {
      id: 4,
      title: 'New Message in Web Tech Group',
      message: 'Arjun posted 3 new resources in the Web Technologies study group.',
      type: 'message',
      time: '5h ago',
      read: true,
    },
    {
      id: 5,
      title: 'Library Book Due Tomorrow',
      message: 'Reminder: "Database System Concepts" by Silberschatz is due for return tomorrow.',
      type: 'reminder',
      time: 'Yesterday',
      read: true,
    },
  ],
  unreadCount: 2,
  toasts: [],

  markAsRead: (id) => set((state) => {
    const updated = state.notifications.map(n => n.id === id ? { ...n, read: true } : n);
    return {
      notifications: updated,
      unreadCount: updated.filter(n => !n.read).length
    };
  }),

  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
    unreadCount: 0
  })),

  addToast: (message, type = 'info') => set((state) => ({
    toasts: [...state.toasts, { id: Date.now(), message, type }]
  })),

  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
}));
