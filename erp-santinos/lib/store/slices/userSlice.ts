import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    id: number | null;
    email: string | null;
    role: string | null;
    permissions: string[];
    full_name: string | null;
    profile_photo: string | null;
    school_id: number | null;
    is_platform_admin: boolean;
    isAuthenticated: boolean;
}

const initialState: UserState = {
    id: null,
    email: null,
    role: null,
    permissions: [],
    full_name: null,
    profile_photo: null,
    school_id: null,
    is_platform_admin: false,
    isAuthenticated: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<Partial<UserState>>) => {
            return { ...state, ...action.payload, isAuthenticated: true };
        },
        clearUser: () => {
            return initialState;
        },
        updateUserDetail: (state, action: PayloadAction<Partial<UserState>>) => {
            return { ...state, ...action.payload };
        }
    },
});

export const { setUser, clearUser, updateUserDetail } = userSlice.actions;
export default userSlice.reducer;
