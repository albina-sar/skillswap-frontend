import { User } from '@/shared/types'

export type HeaderProps = {
  isAuth: boolean
  user: User
  categories: React.ReactNode
  notify: React.ReactNode
  hasNotifications?: boolean
  isSkillsOpen: boolean
  onSkillsOpenChange: (value: boolean) => void
}

