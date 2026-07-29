import { selectSkills } from '@/entities/skill/model/skillsSlice'
import { selectUsers } from '@/entities/user/model/usersSlice'
import { CATEGORIES_DATA } from '@/shared/lib/constants'
import { Skill, Subcategory, User } from '@/shared/types'
import { UserCard } from '@/shared/ui/UserCard'
import { useAppSelector } from '@/store/hooks'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

interface UserCardElementProps {
  authorid: string
  variant?: 'catalog' | 'skill'
}

export const UserCardElement: FC<UserCardElementProps> = ({ authorid, variant }) => {
  const skills = useAppSelector(selectSkills) as Skill[]
  const users = useAppSelector(selectUsers) as User[]
  const navigate = useNavigate()

  if (users.length === 0 || skills.length === 0) {
    return <div>Загрузка...</div>
  }

  // получаем пользователя
  const getedUser = users.find((user) => user.id === authorid) as User

  if (!getedUser) {
    return <div>Автор не найден</div>
  }

  //чему может научить
  const getTeachSkill = skills.find((skill) => getedUser.skills.includes(skill.id)) as Skill

  //чему хочет научиться
  const getLearnSkills: Subcategory[] = CATEGORIES_DATA.flatMap(
    (category) => category.subcategories,
  ).filter((sub) => getedUser.wantsToLearn.includes(sub.id))

  return (
    <UserCard
      user={getedUser}
      teachSkill={getTeachSkill}
      learnSkills={getLearnSkills}
      onDetailsClick={() => navigate(`/skill/${getTeachSkill.id}`)}
      variant={variant}
    />
  )
}
