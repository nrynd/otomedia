// store/themePersistence.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setTheme } from './themeSlice';
import type { AppDispatch } from '.'; // sesuaikan path

const THEME_KEY = 'APP_THEME_V1';

export const saveThemeToStorage = async (theme: any) => {
    try {
        await AsyncStorage.setItem(THEME_KEY, JSON.stringify(theme));
    } catch (e) {
        console.warn('Failed saving theme', e);
    }
};

export const loadThemeFromStorage = () => async (dispatch: AppDispatch) => {
    try {
        const raw = await AsyncStorage.getItem(THEME_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            dispatch(setTheme(parsed));
        }
    } catch (e) {
        console.warn('Failed loading theme', e);
    }
};
