// theme/palettes.ts
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { brandColor } from '../utils/brandColor';

export const LightPaperTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        ...brandColor.light,
    },
};

export const DarkPaperTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        ...brandColor.dark,
    },
};
