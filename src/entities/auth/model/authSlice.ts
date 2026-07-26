import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser } from './types';
import { getAuthUser, saveAuthUser, clearAuthUser } from '@/features/auth/model/authUtils';
import type { RootState } from '@/store';
import { loginWithCredentials } from '@/features/account/model/accountUtils';

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
);

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

export const loginUser = createAsyncThunk<
  AuthUser,
  { email: string; password: string },
  { rejectValue: string }
>('auth/loginUser', ({ email, password }, { rejectWithValue }) => {
  try {
    const account = loginWithCredentials(email, password)
    return saveAuthUser({ id: account.id, name: account.name, email: account.email })
  } catch (loginError) {
    return rejectWithValue(loginError instanceof Error ? loginError.message : 'Ошибка входа')
  }
});

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserData.pending, (state) => {
                state.isLoading = true;
                state.isAuthChecked = false;
                state.error = null;
            })
            .addCase(getUserData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthChecked = true;
                state.isAuth = true;
                state.userData = action.payload;
            })
            .addCase(getUserData.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuth = false;
                state.isAuthChecked = true;
                state.error = action.payload ?? 'Неизвестная ошибка';
            })

            .addCase(clearUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(clearUser.fulfilled, (state) => {
                state.isLoading = false;
                state.isAuth = false;
                state.isAuthChecked = false;
                state.userData = initialState.userData;
            })
            .addCase(clearUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? 'Неизвестная ошибка';
            })

            // saveUser и loginUser ведут себя одинаково при pending/fulfilled/rejected, поэтому можно объединить
            .addMatcher(
                (action) =>
                    action.type === saveUser.pending.type ||
                    action.type === loginUser.pending.type,
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action): action is PayloadAction<AuthUser> =>
                    action.type === saveUser.fulfilled.type ||
                    action.type === loginUser.fulfilled.type,
                (state, action) => {
                    state.isLoading = false;
                    state.isAuth = true;
                    state.isAuthChecked = true;
                    state.userData = action.payload;
                }
            )
            .addMatcher(
                (action): action is PayloadAction<string | undefined> =>
                    action.type === saveUser.rejected.type ||
                    action.type === loginUser.rejected.type,
                (state, action) => {
                    state.isLoading = false;
                    state.isAuth = false;
                    state.isAuthChecked = true;
                    state.error = action.payload ?? 'Неизвестная ошибка';
                }
            )
    }
});

export const selectIsAuth = (state: RootState) => state.auth.isAuth;
export const selectIsAuthChecked = (state: RootState) => state.auth.isAuthChecked;
export const selectIsAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectUserData = (state: RootState) => state.auth.userData;

export default authSlice.reducer;