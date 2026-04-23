import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
    id: number;
    message: string;
    description: string;
    notification_type: 'success' | 'info' | 'warning' | 'error';
    read: boolean;
    timestamp: string;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
}

const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'read' | 'timestamp'>>) => {
            const newNotification: Notification = {
                ...action.payload,
                id: Date.now(),
                read: false,
                timestamp: new Date().toISOString(),
            };
            state.notifications.unshift(newNotification);
            state.unreadCount += 1;
        },
        hydrateNotifications: (state, action: PayloadAction<Notification[]>) => {
            state.notifications = action.payload;
            state.unreadCount = action.payload.filter(n => !n.read).length;
        },
        markAsRead: (state, action: PayloadAction<number>) => {
            const index = state.notifications.findIndex(n => n.id === action.payload);
            if (index !== -1 && !state.notifications[index].read) {
                state.notifications[index].read = true;
                state.unreadCount -= 1;
            }
        },
        clearAllNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        },
        markAllAsRead: (state) => {
            state.notifications.forEach(n => n.read = true);
            state.unreadCount = 0;
        }
    },
});

export const { addNotification, hydrateNotifications, markAsRead, clearAllNotifications, markAllAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;
