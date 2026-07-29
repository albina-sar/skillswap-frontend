import { configureStore } from '@reduxjs/toolkit'
import usersReducer from '../entities/user/model/usersSlice';
// Импортируй свои slice'ы здесь по мере их создания:
import skillsReducer from '@/entities/skill/model/skillsSlice'
import authReducer from '@/entities/auth/model/authSlice'
import accountReducer from '@/entities/account/model/accountSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    skills: skillsReducer,
    auth: authReducer,
    account: accountReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
