import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import brandingReducer from './slices/brandingSlice';
import notificationReducer from './slices/notificationSlice';
import academicYearReducer from './slices/academicYearSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        branding: brandingReducer,
        notifications: notificationReducer,
        academicYear: academicYearReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
