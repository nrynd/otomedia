import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, Animated } from 'react-native';
import { ActivityIndicator, FAB, Searchbar, Text, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/AppNavigator';
import UserItem from '../components/UserItem';
import { useUsers } from '../hooks/useUsers';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '../store/userSlice';

type Props = NativeStackScreenProps<MainStackParamList, 'List'>;

const ListScreen: React.FC<Props> = ({ navigation }) => {
    const { colors } = useTheme();
    const { users, loading, removeUser, loadUsers } = useUsers();
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!loading) {
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            opacity.setValue(0);
        }
    }, [loading, opacity]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadUsers();
        setRefreshing(false);
    }, [loadUsers]);

    const filteredUsers = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return users.filter(
            (user: User) =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
        );
    }, [users, searchQuery]);

    const keyExtractor = useCallback((item: { id: number }) => item.id.toString(), []);

    const renderItem = useCallback(
        ({ item }: { item: User }) => (
            <UserItem
                user={item}
                onEdit={() => navigation.navigate('Form', { id: item.id })}
                onDelete={() => removeUser(item.id)}
            />
        ),
        [navigation, removeUser]
    );

    const listEmptyComponent = useMemo(
        () => (
            <View style={styles.emptyState}>
                <Text variant="titleMedium" style={styles.emptyText}>
                    No users found
                </Text>
            </View>
        ),
        []
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.onPrimary }]}>
            <Searchbar
                placeholder="Search user..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={[
                    styles.searchbar,
                    {
                        backgroundColor: colors.onPrimary,
                        borderBottomWidth: 1,
                        borderColor: colors.outlineVariant,
                    },
                ]}
                inputStyle={{ fontSize: 15 }}
            />

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={colors.primary} animating />
                </View>
            ) : (
                <Animated.View style={{ flex: 1, opacity }}>
                    <FlatList
                        data={filteredUsers}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        ListEmptyComponent={listEmptyComponent}
                        contentContainerStyle={[
                            styles.listContainer,
                            filteredUsers.length === 0 && { flex: 1, justifyContent: 'center' },
                        ]}
                        ListFooterComponent={<View style={{ height: 100 }} />}
                        removeClippedSubviews
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                        showsVerticalScrollIndicator={false}
                    />

                    <FAB
                        icon="plus"
                        mode="elevated"
                        style={[styles.fab, { backgroundColor: colors.primary }]}
                        color="white"
                        onPress={() => navigation.navigate('Form', {})}
                    />

                </Animated.View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchbar: {
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 12,
        borderRadius: 8,
        elevation: 1,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        paddingHorizontal: 16,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 50,
        elevation: 5,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
    },
});

export default ListScreen;
