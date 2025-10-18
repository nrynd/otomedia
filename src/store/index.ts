import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './userSlice';
import themeReducer from './themeSlice'

const store = configureStore({
    reducer: {
        users: usersReducer,
        theme: themeReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
