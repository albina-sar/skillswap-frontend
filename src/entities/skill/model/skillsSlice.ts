import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchSkills } from '@/api/skills'
import type { RootState } from '@/store'
import type { Skill } from './types'

interface SkillsState {
  items: Skill[]
  loading: boolean
  error: string | null
}

const initialState: SkillsState = {
  items: [],
  loading: false,
  error: null,
}

export const loadSkills = createAsyncThunk('skills/load', fetchSkills)

const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadSkills.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadSkills.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(loadSkills.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Не удалось загрузить навыки'
      })
  },
})

export default skillsSlice.reducer

// Данные читаются через селекторы из слайса, а не прямым обращением к state
export const selectSkills = (state: RootState) => state.skills.items
export const selectSkillsLoading = (state: RootState) => state.skills.loading
export const selectSkillsError = (state: RootState) => state.skills.error
