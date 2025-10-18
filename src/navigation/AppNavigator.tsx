import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import ListScreen from '../screens/ListScreen';
import FormScreen from '../screens/FormScreen';
import { IconButton, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { toggleTheme } from '../store/themeSlice';

export type MainStackParamList = {
    List: undefined;
    Form: { id?: number };
};

const MainStack = createNativeStackNavigator<MainStackParamList>();

const MainStackScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const themeMode = useSelector((state: RootState) => state.theme.mode);
    const { colors } = useTheme();

    const headerRightToggle = () => (
        <IconButton
            icon={themeMode === 'light' ? 'weather-night' : 'white-balance-sunny'}
            iconColor={colors.primary}
            onPress={() => dispatch(toggleTheme())}
        />
    );

    return (
        <MainStack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.primary,
                headerRight: headerRightToggle,
            }}
        >
            <MainStack.Screen name="List" component={ListScreen} />
            <MainStack.Screen name="Form" component={FormScreen} />
        </MainStack.Navigator>
    );
}

const AppNavigator = () => {
    const [showSplash, setShowSplash] = useState(true);

    return (
        <NavigationContainer>
            {showSplash ?
                <SplashScreen onFinish={() => setShowSplash(false)} /> :
                <MainStackScreen />}
        </NavigationContainer>
    );
}

export default AppNavigator;
