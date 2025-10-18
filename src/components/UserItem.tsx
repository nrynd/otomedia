import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, IconButton, useTheme, TouchableRipple } from 'react-native-paper';
import { User } from '../store/userSlice';

interface Props {
    user: User;
    onEdit: () => void;
    onDelete: () => void;
}

const UserItem: React.FC<Props> = ({ user, onEdit, onDelete }) => {
    const { colors } = useTheme();

    return (
        <Card style={[styles.card, { backgroundColor: colors.surface }]} mode="elevated">
            <TouchableRipple
                onPress={onEdit}
                borderless
                style={styles.inner}
            >
                <View style={styles.inner}>
                    <View style={styles.textContainer}>
                        <Text style={[styles.name, { color: colors.onSurface }]} numberOfLines={1}>
                            {user.name}
                        </Text>
                        <Text style={[styles.email, { color: colors.outline }]} numberOfLines={1}>
                            {user.email}
                        </Text>
                    </View>
                    <View style={styles.actions}>
                        <IconButton
                            icon="pencil"
                            size={20}
                            iconColor={colors.primary}
                            onPress={onEdit}
                        />
                        <IconButton
                            icon="delete"
                            size={20}
                            iconColor={colors.error}
                            onPress={onDelete}
                        />
                    </View>
                </View>
            </TouchableRipple>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: 8,
        borderRadius: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    inner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontWeight: '700',
        fontSize: 17,
    },
    email: {
        fontSize: 14,
        marginTop: 3,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default React.memo(UserItem);


