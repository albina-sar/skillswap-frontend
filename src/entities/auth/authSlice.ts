import { createSlice, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import { AuthUser } from '@/shared/types';
import { getAuthUser, saveAuthUser, clearAuthUser } from '@/features/auth/model/authUtils';

interface IAuthState {
    isAuth: boolean;
    isAuthChecked: boolean;
    isLoading: boolean;
    userData: AuthUser;
    error: string | null;
}

const initialState: IAuthState = {
    isAuth: false,
    isAuthChecked: false,
    isLoading: false,
    userData: {
        id: '',
        name: '',
        email: '',
        token: ''
    },
    error: null
}

export const getUserData = createAsyncThunk<AuthUser, void, { rejectValue: string }>(
  'auth/userData',
  async (_, { rejectWithValue }) => {
    const userData = await getAuthUser();
    if (!userData) {
      return rejectWithValue('Пользователь не авторизован');
    }
    return userData;
  }
);

export const saveUser = createAsyncThunk<AuthUser, AuthUser, {rejectValue: string }>(
    'auth/saveUser',
    async ({id, name, email }: AuthUser, { rejectWithValue }) => {
        const userData = await saveAuthUser({id, name, email});
        if (!userData) {
            return rejectWithValue('Ошибка сохранения данных пользователя');
        }
        return userData;
    }
)

export const clearUser = createAsyncThunk<void, void, { rejectValue: string }>(
    'auth/clearUser',
    async (_, { rejectWithValue }) => {
        try {
            clearAuthUser();
        } catch {
            return rejectWithValue('Ошибка очистки данных пользователя');
        }
    }
);


