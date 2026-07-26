import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { UserAccount } from './types';
import {
  saveAccount,
  getProfile,
  updateProfile,
  changePassword as changePasswordUtil,
} from '@/features/account/model/accountUtils';
import type { RootState } from '@/store';

type Profile = Omit<UserAccount, 'password'>;

interface IAccountState {
  profile: Profile | null
  isLoading: boolean
  error: string | null
};

const initialState: IAccountState = {
  profile: null,
  isLoading: false,
  error: null,
};

export const registerAccount = createAsyncThunk<Profile, UserAccount, { rejectValue: string }>(
  'account/register',
  (account, { rejectWithValue }) => {
    try {
      const saved = saveAccount(account);
      const { password, ...profile } = saved;
      return profile
    } catch {
      return rejectWithValue('Не удалось создать аккаунт');
    };
  }
)

export const getAccountProfile = createAsyncThunk<Profile, string, { rejectValue: string }>(
  'account/getProfile',
  (id, { rejectWithValue }) => {
    const profile = getProfile(id);
    if (!profile) {
      return rejectWithValue('Профиль не найден');
    }
    return profile
  }
)

export const updateAccountProfile = createAsyncThunk<
  Profile,
  { id: string; updates: Partial<Omit<UserAccount, 'id' | 'password'>> },
  { rejectValue: string }
>('account/updateProfile', ({ id, updates }, { rejectWithValue }) => {
  const profile = updateProfile(id, updates);
  if (!profile) {
    return rejectWithValue('Не удалось обновить профиль');
  };
  return profile
})

export const changePassword = createAsyncThunk<
  void,
  { id: string; currentPassword: string; newPassword: string },
  { rejectValue: string }
>('account/changePassword', ({ id, currentPassword, newPassword }, { rejectWithValue }) => {
  try {
    changePasswordUtil(id, currentPassword, newPassword);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Не удалось сменить пароль');
  };
})

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addMatcher(
        (action) => action.type.startsWith('account/') && action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action): action is PayloadAction<Profile> =>
          action.type.startsWith('account/') &&
          action.type.endsWith('/fulfilled') &&
          action.type !== changePassword.fulfilled.type, // не трогаем profile при смене пароля
        (state, action) => {
          state.isLoading = false;
          state.profile = action.payload;
        }
      )
      
      .addMatcher(
        (action): action is PayloadAction<string | undefined> =>
            action.type.startsWith('account/') &&
            action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload ?? 'Неизвестная ошибка';
        }
      )
  },
})

export const selectAccountProfile = (state: RootState) => state.account.profile
export const selectIsAccountLoading = (state: RootState) => state.account.isLoading
export const selectAccountError = (state: RootState) => state.account.error

export default accountSlice.reducer;