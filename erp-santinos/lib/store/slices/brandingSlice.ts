import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BrandingColors {
    primary: string;
    primaryHover: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
}

interface BrandingState {
    colors: BrandingColors;
}

const defaultColors: BrandingColors = {
    primary: "#5d4037",
    primaryHover: "#3e2723",
    secondary: "#f1f5f9",
    accent: "#7c3aed",
    background: "#f8fafc",
    surface: "#ffffff",
};

const initialState: BrandingState = {
    colors: defaultColors,
};

const brandingSlice = createSlice({
    name: 'branding',
    initialState,
    reducers: {
        setColors: (state, action: PayloadAction<Partial<BrandingColors>>) => {
            state.colors = { ...state.colors, ...action.payload };
        },
        resetBranding: (state) => {
            state.colors = defaultColors;
        }
    },
});

export const { setColors, resetBranding } = brandingSlice.actions;
export default brandingSlice.reducer;
