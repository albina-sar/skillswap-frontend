import { useLocalStorage } from '../../../shared/hooks/useLocalStorage'

const LIKED_SKILLS_STORAGE_KEY = 'likedSkills'

export function useLike(skillId: number, baseLikeCount: number) {
  // Используем готовый хук команды для работы с localStorage
  const [likedSkills, setLikedSkills] = useLocalStorage<number[]>(LIKED_SKILLS_STORAGE_KEY, [])

  // Проверяем, есть ли текущий скилл в списке лайкнутых
  const isLiked = likedSkills.includes(skillId)

  // Функция переключения лайка
  const toggleLike = () => {
    if (isLiked) {
      // Если уже лайкнут - убираем из массива
      setLikedSkills(likedSkills.filter((id) => id !== skillId))
    } else {
      // Если не лайкнут - добавляем в массив
      setLikedSkills([...likedSkills, skillId])
    }
  }

  // Считаем общее количество: из стора + наш локальный лайк
  const totalLikes = baseLikeCount + (isLiked ? 1 : 0)

  return {
    isLiked,
    totalLikes,
    toggleLike,
  }
}
