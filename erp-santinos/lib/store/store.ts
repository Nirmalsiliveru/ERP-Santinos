import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session'; // Use session storage for security or 'storage' for local
import userReducer from './slices/userSlice';
import brandingReducer from './slices/brandingSlice';
import notificationReducer from './slices/notificationSlice';
import academicYearReducer from './slices/academicYearSlice';

const rootReducer = combineReducers({
    user: userReducer,
    branding: brandingReducer,
    notifications: notificationReducer,
    academicYear: academicYearReducer,
});

const persistConfig = {
    key: 'bodhiedu-root',
    version: 1,
    storage,
    whitelist: ['notifications', 'branding', 'academicYear'], // Only persist these
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
