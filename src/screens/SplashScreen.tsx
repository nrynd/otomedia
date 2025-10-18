import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, Dimensions, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
        ]).start();

        const timer = setTimeout(() => {
            onFinish();
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <LinearGradient colors={['#4A90E2', '#9013FE']} style={styles.container}>
            <Animated.View
                style={[
                    styles.logoContainer,
                    { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
                ]}
            >
                <Image
                    source={require('../assets/imgs/otomedia.png')}
                    style={{ width: '70%', height: null, aspectRatio: 1 }}
                    resizeMethod='resize'
                    resizeMode='contain'
                />
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    logoContainer: {
        marginBottom: 50,
    },
    logo: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 1,
    },
    button: {
        width: width * 0.6,
        paddingVertical: 14,
        borderRadius: 25,
    },
    particle: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#fff4',
    },
});

