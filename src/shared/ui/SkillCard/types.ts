import type { Skill } from '@/shared/types'

export interface SkillCardProps {
  skill: Skill
  isFavorite: boolean
  onFavoriteClick: () => void
}
