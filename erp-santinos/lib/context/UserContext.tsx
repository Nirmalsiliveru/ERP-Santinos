"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { useDispatch } from "react-redux";
import { setUser as setReduxUser, clearUser as clearReduxUser } from "@/lib/store/slices/userSlice";

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
    school_id: number | null;
}

interface UserContextType {
    user: User | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
    user: null,
    loading: true,
    refreshUser: async () => { },
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            dispatch(clearReduxUser());
            setLoading(false);
            return;
        }

        try {
            const response = await api.get("/");
            const userData = response.data.user;
            setUser(userData);
            dispatch(setReduxUser(userData));
        } catch (error) {
            console.error("Failed to fetch user:", error);
            localStorage.removeItem("token");
            setUser(null);
            dispatch(clearReduxUser());
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return (
        <UserContext.Provider value={{ user, loading, refreshUser: fetchUser }}>
            {children}
        </UserContext.Provider>
    );
}
