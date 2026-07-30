import { useMemo } from 'react'
import { useAppSelector } from '@/store/hooks'
import { selectSkills } from '@/entities/skill/model/skillsSlice'
import { CATEGORIES_DATA } from '@/shared/lib/constants'
import type { SearchSuggestion } from './types'

export const useSearchSuggestions = (query: string): SearchSuggestion[] => {
  const skills = useAppSelector(selectSkills)

  return useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase()

    if (!trimmedQuery) {
      return []
    }

    const matches = (name: string) => name.toLowerCase().includes(trimmedQuery)

    const categoryMatches: SearchSuggestion[] = CATEGORIES_DATA
      .filter((category) => matches(category.name))
      .map((category) => ({ type: 'category', id: category.id, name: category.name }))

    const subcategoryMatches: SearchSuggestion[] = CATEGORIES_DATA
      .flatMap((category) =>
        category.subcategories
          .filter((sub) => matches(sub.name))
          .map((sub) => ({ type: 'subcategory', id: sub.id, name: sub.name, categoryId: category.id }))
      )

    const skillMatches: SearchSuggestion[] = skills
      .filter((skill) => matches(skill.title))
      .map((skill) => ({ type: 'skill', id: skill.id, title: skill.title }))

    return [...categoryMatches, ...subcategoryMatches, ...skillMatches]
  }, [query, skills])
}