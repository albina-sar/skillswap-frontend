import { useState, useMemo, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../../store/hooks'
import {
  selectSkills,
  selectSkillsLoading,
  loadSkills,
} from '../../../entities/skill/model/skillsSlice'
import { selectUsers, fetchUsersThunk } from '../../../entities/user/model/usersSlice'
import {
  filterGroups,
  FiltersState,
  getDefaultFilterValues,
} from '../../../features/filters/model/filterGroups'
import { citiesMap } from '../lib/maps'

export function useCatalogFilters() {
  const dispatch = useAppDispatch()
  const skills = useAppSelector(selectSkills)
  const users = useAppSelector(selectUsers)
  const loading = useAppSelector(selectSkillsLoading)

  // Загрузка данных при монтировании
  useEffect(() => {
    dispatch(loadSkills())
    dispatch(fetchUsersThunk())
  }, [dispatch])

  // Мапа пользователей для быстрого доступа по ID
  const usersMap = useMemo(() => {
    const map = new Map()
    users.forEach((user) => map.set(user.id, user))
    return map
  }, [users])

  // Состояние фильтров
  const [filters, setFilters] = useState<FiltersState>(getDefaultFilterValues(filterGroups))

  const handleFiltersChange = (newFilters: FiltersState) => {
    setFilters(newFilters)
  }

  // Логика фильтрации
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const author = usersMap.get(skill.authorId)
      const skillLearningType = (skill as any).learningType ?? 'any'

      // Фильтр по типу
      if (filters.learningType !== 'any' && skillLearningType !== filters.learningType) return false

      // Фильтр по категориям/подкатегориям
      if (Array.isArray(filters.skills) && filters.skills.length > 0) {
        const hasMatchingCategory =
          filters.skills.includes(skill.categoryId) || filters.skills.includes(skill.subcategoryId)

        if (!hasMatchingCategory) return false
      }

      // Фильтр по полу автора
      const normalizedGender =
        author?.gender === 'мужской' ? 'male' : author?.gender === 'женский' ? 'female' : 'any'
      if (filters.gender !== 'any' && normalizedGender !== filters.gender) return false

      // Фильтр по городу
      if (Array.isArray(filters.city) && filters.city.length > 0) {
        const authorCityName = author?.city
        const hasMatchingCity = filters.city.some(
          (cityId) => citiesMap.get(cityId) === authorCityName,
        )
        if (!hasMatchingCity) return false
      }

      return true
    })
  }, [skills, usersMap, filters])

  return {
    filteredSkills,
    loading,
    filters,
    handleFiltersChange,
  }
}
