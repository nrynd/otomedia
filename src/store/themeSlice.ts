import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '.';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
    mode: ThemeMode;
}

const initialState: ThemeState = {
    mode: 'system', // default system
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setThemeMode(state, action: PayloadAction<ThemeMode>) {
            state.mode = action.payload;
        },
        setThemeFromStorage(state, action: PayloadAction<ThemeMode>) {
            state.mode = action.payload;
        },
    },
});

export const setThemeModeAsync = (mode: ThemeMode) => async (dispatch: AppDispatch) => {
    dispatch(setThemeMode(mode));
    try {
        await AsyncStorage.setItem('themeMode', mode);
    } catch (err) {
        console.error('Failed to save theme', err);
    }
};


export const toggleTheme = () => (dispatch: AppDispatch, getState: () => RootState) => {
    const current = getState().theme.mode;
    const next: ThemeMode = current === 'light' ? 'dark' : 'light';
    dispatch(setThemeModeAsync(next));
};


export const { setThemeMode, setThemeFromStorage } = themeSlice.actions;

export const loadThemeFromStorage = () => async (dispatch: AppDispatch) => {
    try {
        const stored = await AsyncStorage.getItem('themeMode');
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
            dispatch(setThemeFromStorage(stored));
        }
    } catch (err) {
        console.error('Failed to load theme', err);
    }
};

export default themeSlice.reducer;
