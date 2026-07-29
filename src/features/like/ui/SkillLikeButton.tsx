import { useNavigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { selectIsAuth, selectIsAuthChecked } from '@/entities/auth/model/authSlice'
import { ROUTES } from '@/shared/lib/constants'
import { LikeButton } from '@/shared/ui/likeButton'
import { useLike } from '../hooks'

interface SkillLikeButtonProps {
  skillId: string
  baseLikeCount: number
}

export function SkillLikeButton({ skillId, baseLikeCount }: SkillLikeButtonProps) {
  // Подключаем нашу логику
  const { isLiked, totalLikes, toggleLike } = useLike(skillId, baseLikeCount)

  // Получаем статус авторизации
  const isAuth = useAppSelector(selectIsAuth)
  const isAuthChecked = useAppSelector(selectIsAuthChecked)

  const navigate = useNavigate()
  const location = useLocation()

  const handleLikeClick = () => {
    // Если проверка авторизации еще не завершилась, игнорируем клик
    if (!isAuthChecked) {
      return
    }

    // Если проверка завершена, но пользователь не авторизован
    if (!isAuth) {
      navigate(ROUTES.LOGIN, { state: { from: location.pathname } })
      return
    }

    toggleLike()
  }

  // Рендерим готовую UI-кнопку из shared
  return <LikeButton isLiked={isLiked} likeCount={totalLikes} onToggle={handleLikeClick} />
}
