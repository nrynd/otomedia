import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateUser, deleteUser, setUsers, User, setLoading } from '../store/userSlice';
import { initDB, getUsers as getUsersDB, addUserDB, updateUserDB, deleteUserDB } from '../db/database';

export const useUsers = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector((state: RootState) => state.users);

    const loadUsers = async () => {
        try {
            dispatch(setLoading(true));

            const db = await initDB();
            const list = await getUsersDB(db);

            dispatch(setUsers(list));
        } catch (error) {
            console.error('Failed to load users: ', error)
        } finally {
            dispatch(setLoading(false));
        }
    };

    const createUser = async (user: Omit<User, 'id'>) => {
        const db = await initDB();
        await addUserDB(db, user);
        await loadUsers();
    };

    const editUser = async (user: User) => {
        const db = await initDB();
        await updateUserDB(db, user);
        dispatch(updateUser(user));
    };

    const removeUser = async (id: number) => {
        const db = await initDB();
        await deleteUserDB(db, id);
        dispatch(deleteUser(id));
    };

    useEffect(() => {
        loadUsers();
    }, []);

    return { users, loading, createUser, editUser, removeUser, loadUsers };
};
