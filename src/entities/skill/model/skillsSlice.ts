import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchSkills } from '@/api/skills'
import { getCreatedSkills, saveCreatedSkill } from '@/features/skills/model/skillsUtils'
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

export const loadSkills = createAsyncThunk('skills/load', async () => {
  const baseSkills = await fetchSkills();
  const createdSkills = getCreatedSkills();
  return [...baseSkills, ...createdSkills]
})

export const createSkill = createAsyncThunk<
  Skill,
  Omit<Skill, 'id' | 'createdAt' | 'likesCount'>,
  { rejectValue: string }
>('skills/create', (skill, { rejectWithValue }) => {
  try {
    return saveCreatedSkill(skill);
  } catch {
    return rejectWithValue('Не удалось создать навык');
  }
})

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
      .addCase(createSkill.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(createSkill.rejected, (state, action) => {
        state.error = action.payload ?? 'Не удалось создать навык'
      })
  },
})

export default skillsSlice.reducer

export const selectSkills = (state: RootState) => state.skills.items
export const selectSkillsLoading = (state: RootState) => state.skills.loading
export const selectSkillsError = (state: RootState) => state.skills.error