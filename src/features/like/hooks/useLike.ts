import { useCallback, useMemo } from 'react'
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage'

const LIKED_SKILLS_STORAGE_KEY = 'likedSkills'

export function useLike(skillId: string, baseLikeCount: number) {
  const [likedSkills, setLikedSkills] = useLocalStorage<string[]>(LIKED_SKILLS_STORAGE_KEY, [])

  // useMemo пересоздаёт Set только при изменении массива
  const likedSkillsSet = useMemo(() => new Set(likedSkills), [likedSkills])
  const isLiked = likedSkillsSet.has(skillId)

  // useCallback — функция не пересоздаётся при каждом рендере
  const toggleLike = useCallback(() => {
    setLikedSkills((prev) => {
      if (prev.includes(skillId)) {
        return prev.filter((id) => id !== skillId)
      }
      return [...prev, skillId]
    })
  }, [skillId, setLikedSkills])

  const totalLikes = baseLikeCount + (isLiked ? 1 : 0)

  return {
    isLiked,
    totalLikes,
    toggleLike,
  }
}
