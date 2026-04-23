import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AcademicYear {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
}

interface AcademicYearState {
    currentYear: AcademicYear | null;
    availableYears: AcademicYear[];
    loading: boolean;
}

const initialState: AcademicYearState = {
    currentYear: null,
    availableYears: [],
    loading: false,
};

const academicYearSlice = createSlice({
    name: 'academicYear',
    initialState,
    reducers: {
        setAcademicYears: (state, action: PayloadAction<AcademicYear[]>) => {
            state.availableYears = action.payload;
            state.currentYear = action.payload.find(y => y.is_active) || action.payload[0] || null;
        },
        setCurrentYear: (state, action: PayloadAction<number>) => {
            const year = state.availableYears.find(y => y.id === action.payload);
            if (year) {
                state.currentYear = year;
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        }
    },
});

export const { setAcademicYears, setCurrentYear, setLoading } = academicYearSlice.actions;
export default academicYearSlice.reducer;
