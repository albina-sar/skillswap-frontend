import { LikeButton } from '@/shared/ui/likeButton'
import { useLike } from '../hooks'

interface SkillLikeButtonProps {
  skillId: number
  baseLikeCount: number // Количество лайков из стора/бэкенда
}

export function SkillLikeButton({ skillId, baseLikeCount }: SkillLikeButtonProps) {
  // Подключаем нашу логику
  const { isLiked, totalLikes, toggleLike } = useLike(skillId, baseLikeCount)

  // Рендерим готовую UI-кнопку из shared
  return <LikeButton isLiked={isLiked} likeCount={totalLikes} onToggle={toggleLike} />
}
