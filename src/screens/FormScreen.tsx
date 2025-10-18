import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Animated,
} from 'react-native';
import {
    TextInput,
    Button,
    useTheme,
    Surface,
    Text,
    TouchableRipple,
} from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/AppNavigator';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useUsers } from '../hooks/useUsers';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<MainStackParamList, 'Form'>;

interface FormInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    icon?: string;
    keyboardType?: 'default' | 'email-address' | 'numeric';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    error?: boolean;
}
const FormInput: React.FC<FormInputProps> = React.memo(({
    label,
    value,
    onChangeText,
    icon,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
    error = false,
}) => {
    const { colors } = useTheme();
    return (
        <TextInput
            mode="outlined"
            label={label}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            style={styles.input}
            outlineColor={error ? colors.error : colors.outline}
            activeOutlineColor={error ? colors.error : colors.primary}
            placeholderTextColor={colors.outline}
            left={icon ? <TextInput.Icon icon={icon} /> : undefined}
            autoFocus={label === 'Name'}
        />
    );
});

const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const FormScreen: React.FC<Props> = ({ route, navigation }) => {
    const { colors } = useTheme();
    const { id } = route.params || {};
    const { createUser, editUser } = useUsers();

    const existingUser = useSelector((state: RootState) =>
        state.users.users.find(u => u.id === id)
    );

    const [name, setName] = useState(existingUser?.name || '');
    const [email, setEmail] = useState(existingUser?.email || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const scale = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    const handlePressIn = () => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
    const handlePressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

    const handleSave = useCallback(async () => {
        if (!name.trim() || !email.trim()) {
            setError('Please fill out all fields.');
            return;
        }
        if (!validateEmail(email)) {
            setError('Please enter a valid email.');
            return;
        }

        try {
            setLoading(true);
            setError('');
            if (id && existingUser) {
                await editUser({ id, name, email });
            } else {
                await createUser({ name, email });
            }
            navigation.goBack();
        } catch (err) {
            setError('Failed to save user.');
        } finally {
            setLoading(false);
        }
    }, [name, email, id, existingUser, createUser, editUser, navigation]);

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <Animated.View style={{ opacity: fadeAnim }}>
                        <Surface style={[styles.formContainer, { backgroundColor: colors.surface }]}>
                            <Text variant="titleMedium" style={[styles.title, { color: colors.primary }]}>
                                {id ? 'Edit User' : 'Add New User'}
                            </Text>

                            <FormInput
                                label="Name"
                                value={name}
                                onChangeText={setName}
                                icon="account"
                                error={!!(error && !name.trim())}
                            />
                            <FormInput
                                label="Email"
                                value={email}
                                onChangeText={setEmail}
                                icon="email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                error={!!(error && (!email.trim() || !validateEmail(email)))}
                            />

                            {error ? (
                                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
                            ) : null}

                            <TouchableRipple
                                borderless
                                onPress={handleSave}
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                style={{ borderRadius: 8 }}
                            >
                                <Animated.View style={{ transform: [{ scale }] }}>
                                    <Button
                                        mode="contained"
                                        loading={loading}
                                        style={styles.button}
                                        contentStyle={{ paddingVertical: 12 }}
                                    >
                                        Save
                                    </Button>
                                </Animated.View>
                            </TouchableRipple>
                        </Surface>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    formContainer: {
        borderRadius: 12,
        elevation: 2,
        padding: 20,
    },
    title: {
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: '600',
    },
    input: {
        marginBottom: 12,
    },
    button: {
        marginTop: 10,
    },
    errorText: {
        marginBottom: 8,
        textAlign: 'center',
    },
});

export default FormScreen;

