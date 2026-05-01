"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { useDispatch } from "react-redux";
import { setUser as setReduxUser, clearUser as clearReduxUser } from "@/lib/store/slices/userSlice";

interface Session {
    id: number;
    name: string;
    is_active: boolean;
}

interface User {
    id: number;
    email: string;
    role: string | null;
    permissions: string[];
    full_name: string | null;
    phone: string | null;
    profile_photo: string | null;
    created_at: string;
    is_platform_admin: boolean;
    must_change_password: boolean;
    school_id: number | null;
}

interface UserContextType {
    user: User | null;
    activeSession: Session | null;
    loading: boolean;
    refreshUser: () => Promise<User | null>;
    setActiveSession: (session: Session) => void;
}

const UserContext = createContext<UserContextType>({
    user: null,
    activeSession: null,
    loading: true,
    refreshUser: async () => null,
    setActiveSession: () => { },
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [activeSession, setActiveSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            setActiveSession(null);
            dispatch(clearReduxUser());
            setLoading(false);
            return null;
        }

        try {
            const response = await api.get("/");
            const userData = response.data.user;
            const sessionData = response.data.active_session;
            
            setUser(userData);
            setActiveSession(sessionData); // Store initial active session from backend
            dispatch(setReduxUser(userData));
            return userData;
        } catch (error) {
            console.error("Failed to fetch user:", error);
            localStorage.removeItem("token");
            setUser(null);
            setActiveSession(null);
            dispatch(clearReduxUser());
            return null;
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return (
        <UserContext.Provider value={{ 
            user, 
            activeSession, 
            loading, 
            refreshUser: fetchUser,
            setActiveSession
        }}>
            {children}
        </UserContext.Provider>
    );
}
