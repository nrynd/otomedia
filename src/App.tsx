/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useMemo, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Animated, useColorScheme } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from './store';
import store, { RootState } from './store';
import AppNavigator from './navigation/AppNavigator';
import { initDB } from './db/database';
import { PaperProvider } from 'react-native-paper';
import { loadThemeFromStorage } from './store/themePersistence';
import { DarkPaperTheme, LightPaperTheme } from './theme/palettes';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    state = { hasError: false };
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(error: any, info: any) {
        console.error('Unhandled error:', error, info);
    }
    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.centered}>
                    <StatusBar barStyle="light-content" />
                    <ActivityIndicator size="large" color="#ff4d6d" />
                    <View style={{ marginTop: 16 }}>
                        <Animated.Text style={{ color: '#ff4d6d', fontSize: 18, textAlign: 'center' }}>
                            Something went wrong!
                        </Animated.Text>
                    </View>
                </View>
            );
        }
        return this.props.children;
    }
}

const ThemedApp = () => {
    const dispatch = useDispatch<AppDispatch>();
    const themeState = useSelector((s: RootState) => s.theme);
    const systemScheme = useColorScheme();
    const [fadeAnim] = useState(new Animated.Value(0));
    const [ready, setReady] = useState(false);

    useEffect(() => {
        (async () => {
            await dispatch(loadThemeFromStorage());
            setReady(true);
        })();
    }, [dispatch]);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    const paperTheme = useMemo(() => {
        const mode = themeState.mode;
        if (mode === 'system') return systemScheme === 'dark' ? DarkPaperTheme : LightPaperTheme;
        return mode === 'dark' ? DarkPaperTheme : LightPaperTheme;
    }, [themeState.mode, systemScheme]);

    if (!ready) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#6200ee" />
            </View>
        );
    }

    return (
        <PaperProvider theme={paperTheme}>
            <StatusBar barStyle={paperTheme.dark ? 'light-content' : 'dark-content'} />
            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                <AppNavigator />
            </Animated.View>
        </PaperProvider>
    );
};

export default function App() {
    const [dbReady, setDbReady] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                await initDB();
            } catch (err) {
                console.error('DB initialization failed', err);
            } finally {
                setDbReady(true);
            }
        })();
    }, []);

    if (!dbReady) {
        return (
            <SafeAreaProvider>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#6200ee" />
                    <Animated.Text style={{ marginTop: 12, fontSize: 16, color: '#6200ee' }}>
                        Loading database...
                    </Animated.Text>
                </View>
            </SafeAreaProvider>
        );
    }

    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <ErrorBoundary>
                    <ThemedApp />
                </ErrorBoundary>
            </SafeAreaProvider>
        </Provider>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
});



