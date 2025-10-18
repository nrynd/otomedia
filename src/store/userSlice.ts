import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type User = {
    id: number;
    name: string;
    email: string;
};

interface UsersState {
    users: User[];
    loading: boolean;
}

const initialState: UsersState = {
    users: [],
    loading: false,
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload;
        },
        addUser: (state, action: PayloadAction<User>) => {
            state.users.push(action.payload);
        },
        updateUser: (state, action: PayloadAction<User>) => {
            const index = state.users.findIndex(u => u.id === action.payload.id);
            if (index !== -1) state.users[index] = action.payload;
        },
        deleteUser: (state, action: PayloadAction<number>) => {
            state.users = state.users.filter(u => u.id !== action.payload);
        },
        setLoading: (state, action: PayloadAction<boolean>) => { // ✅ Action loading
            state.loading = action.payload;
        },
    },
});

export const { setUsers, addUser, updateUser, deleteUser, setLoading } = usersSlice.actions;
export default usersSlice.reducer;
