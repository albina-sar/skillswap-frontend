import { useLocalStorage } from '../../../shared/hooks/useLocalStorage'

const LIKED_SKILLS_STORAGE_KEY = 'likedSkills'

export function useLike(skillId: string, baseLikeCount: number) {
  // Используем общий хук для работы с localStorage
  const [likedSkills, setLikedSkills] = useLocalStorage<string[]>(LIKED_SKILLS_STORAGE_KEY, [])

  // Проверяем, есть ли текущий скилл в списке лайкнутых
  const isLiked = likedSkills.includes(skillId)

  // Функция переключения лайка
  const toggleLike = () => {
    // Вычисляем новый список на основе текущего состояния
    let newLikedSkills: string[]
    if (isLiked) {
      // Убираем ID из массива
      newLikedSkills = likedSkills.filter((id) => id !== skillId)
    } else {
      // Добавляем ID в массив
      newLikedSkills = [...likedSkills, skillId]
    }
    // Сохраняем в localStorage через общий хук
    setLikedSkills(newLikedSkills)
  }

  // Считаем общее количество: из стора + наш локальный лайк
  const totalLikes = baseLikeCount + (isLiked ? 1 : 0)

  return {
    isLiked,
    totalLikes,
    toggleLike,
  }
}
